<template>
  <router-view></router-view>
</template>
<script>
import "./cdn/isobit.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { Network } from "@capacitor/network";

var { _, axios, ui } = window;

export default ui({
  watch: {
    $route() {
      this.resize();
    },
  },
  data() {
    return {
      connected: true,
      showMenu: false,
      showUser: false,
      overlay: null,
      cartItem: [],
      networkStatus: { connected: null },
      lifeStage: [
        { id: 1, name: "NIÑO", min: 0, max: 11 },
        { id: 2, name: "ADOLESCENTE", min: 12, max: 17 },
        { id: 3, name: "JOVEN", min: 18, max: 29 },
        { id: 4, name: "ADULTO", min: 30, max: 59 },
        { id: 5, name: "ADULTO MAYOR", min: 60 },
      ],
      healthInsurance: ["SIS", "ESSALUD/FFAA/PNP", "PRIVADO", "SIN SEGURO"],
    };
  },
  methods: {
    tt(a) {
      if (a.msg) {
        var tp = ["dia", "mes", "año"];
        var tps = ["dias", "meses", "años"];
        var aa = a.msg.split("|");
        var dd = [];
        var dp = aa[1].split("/");
        var pe = Math.abs(dp[2] * 10000 + dp[1] * 100 + dp[0] * 1);
        a.color = a.progress > 100 ? "red" : pe > 300 ? "green" : "yellow";
        dp.forEach((e, i) => {
          if ((e = Math.abs(e)) > 0)
            dd.push(e + " " + (e > 1 ? tps[i] : tp[i]));
        });
        dd = dd.reverse();
        var ds = dd[0];
        dd.forEach((e, i) => {
          if (i > 0) {
            if (i == dd.length - 1) {
              ds += " y " + e;
            } else ds += ", " + e;
          }
        });
        if (a.progress > 100) {
          return "Se paso " + ds + " desde " + aa[0].split(">")[1];
        } else if (pe == 0) {
          return "Ultimo dia";
        } else {
          return "faltan " + ds + " para " + aa[0].split(">")[1];
        }
      } else a.color = "green";
    },
    updateStatus(e) {
      console.log("app.updateStatus " + e);
    },
    toggleMenu() {
      this.$refs.menu.toggle();
    },
    logout() {
      this.$router.push("/logout");
      this.session = null;
      window.axios.config = {};
    },
    download(o) {
      var me = this;
      var fo = new FormData();
      o.year = 1 * o.caso_anio;
      o.number = 1 * o.caso_numero;
      o.company = o.institucion;
      var offender = [];
      if (o.ext.details) {
        o.ext.details[0][4].forEach((e) => {
          if (e.name == "offenders")
            e.value.forEach((e, i) => {
              offender.push(i + 1 + ". " + e.caso_infractor);
            });
        });
      } else
        o.ext.split("|").forEach((e) => {
          var ss = e.split("=");
          if (ss[0].endsWith("caso_infractor")) {
            offender.push(offender.length + 1 + ". " + ss[1]);
          }
        });
      if (offender.length) o.offender = offender.join("\n");
      fo.append(
        "file",
        new Blob([JSON.stringify([o])], { type: "text/plain" }),
        "data.json"
      );
      fo.append("filename", "data.json");
      fo.append("template", "pad");
      me.saveAs("/api/jreport/", fo);
    },
  },
  created() {
    var me = this;
    //me.markerImg = require('@/cdn/images/marker.gif');
    //me.initGPS();
    window.o = me.o;
    _.app = me;
    var session = me.session;

    me.imgError = require('@/cdn/images/smile.png');
    if (session.token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ` + (session.token ? session.token : session.uid),
      };
      me.app.profileImg = session.people ? session.people.urlPerfil : null;
      me.connected = session.connected;
    } else me.$router.push('/');
    me.watcher = localStorage.getItem('watcher');
    if (me.watcher) {
      me.startWatcher();
    }
    var networkStatusChange = (status) => {
      status.connected = status.connected && (me.connected !== undefined ? me.connected : true);
      _.networkStatus = status;
      me.networkStatus = status;
    };
    Network.addListener("networkStatusChange", networkStatusChange);
    Network.getStatus().then(networkStatusChange);
    _.initDB(14, [
      ["region", { keyPath: "id" }, "/admin/directory/api/region/0/0"],
      ["province", { keyPath: "code" }, "/admin/directory/api/province/0/0"],
      ["district", { keyPath: "code" }, "/admin/directory/api/district/0/0"],
      ["vehicle", { keyPath: "id" }, "/api/vehicle"],
      ["setting", { keyPath: "code" }],
      ["location", { keyPath: "time" }]
    ]).then(async () => {
      me.locations = await me.getStoredList('location') || [];
      me.locations = me.locations.sort((a, b) => b.time - a.time);
    });
  },
  mounted() {
    this.bindLinks();
  },
});
</script>
<style>
.v-table tr.v-selected.gray {
  background-color: #6c6969;
}

@font-face {
  font-family: "PTSans";
  src: local("PTSans"),
    url(./cdn/fonts/ptsansnarrow-regular.ttf) format("truetype");
}

.v-widget-header>.v-panel-title {
  background: url(./cdn/images/favicon.png) no-repeat scroll 0 0 transparent;
}

* {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}

#page-header {
  border: 1px solid gray;
  min-height: 36px;
}

#page-header>* {
  min-height: 36px;
}

.primary {
  background-color: #0f62ac;
}

.v-widget-header,
.ui-state-default {
  border: 1px solid #a8a8a8;
  background: #c4c4c4 linear-gradient(top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  background: #c4c4c4 -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0.8)), to(rgba(255, 255, 255, 0)));
  background: #c4c4c4 -moz-linear-gradient(top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  background: #c4c4c4 -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0.8)), to(rgba(255, 255, 255, 0)));
  color: #333;
  font-weight: bold;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
}

.v-button-text-icon-left i,
.v-button-text-icon-left svg,
.tre svg {
  margin-right: 10px;
}

.v-text-icon-left svg {
  margin-right: 10px;
}

.tre li a {
  border-bottom: 1px solid #5d4141;
  padding: 10px;
  font-weight: normal;
}

.tre ul {
  padding-left: 30px;
}

.tre i {
  margin-right: 10px;
  width: 26px;
  text-align: center;
}

#page-header>.v-header-button {
  min-height: 36px;
  padding: 0px 6px;
  display: inline-block;
}

.v-header-button {
  cursor: pointer;
}

.v-header-button:hover {
  background-color: #0e355a;
}

.v-header-button>svg {
  overflow: visible;
  height: 34px;
  width: 22px !important;
  color: white;
}

.ui-datatable thead th,
.ui-datatable tbody td,
.ui-datatable tfoot td,
.ui-datatable tfoot th {
  padding: 4px 5px;
  border-color: #ccd0d4;
  overflow: hidden;
  border: 1px solid #ccd0d4;
}

body {
  overflow-y: unset;
}

.v-popup-2 svg {
  left: 0px;
  top: 0px;
  margin: 10px;
  position: absolute;
}

.v-popup-2 li {
  position: relative;
  border: 1px solid #c1c1c1;
  cursor: pointer;
  padding: 7px 7px 7px 50px;
}

.v-popup-2 li:hover {
  font-weight: bold;
  background-color: #dae1e4;
}

.ui-dialog-content {
  background-color: white;
}

.v-popup-2 {
  list-style-type: none;
}

@media (min-width: 700px) {
  .v-mobil {
    visibility: hidden;
    display: none;
  }
}

@media (max-width: 700px) {
  .v-popup-2 {
    width: 100% !important;
  }

  .ui-datatable-header {
    visibility: hidden;
    display: none;
  }
}

.ic-42 svg {
  height: 36px;
  width: 36px;
  -webkit-filter: brightness(10);
  filter: brightness(10);
  background-size: 34px 34px;
  background-position: 2px 2px;
  background-repeat: no-repeat;
}

.ui-user>a {
  display: inline-block;
  padding: 5px;
}

.ui-user {
  min-height: 0px !important;
  float: right;
  color: white;
  padding: 7px 0px 7px 7px;
  margin: 0px;
}

.x-menu-list {
  z-index: 1005;
  width: -webkit-fill-available;
}

.x-menu-list>li>a {
  padding: 10px 20px;
  display: block !important;
  width: unset !important;
}

.x-menu-bar svg.fa-bars {
  padding: 5px !important;
}

.tre ul>li a>svg {
  width: 24px;
  height: 24px;
}

.ui-panel-titlebar {
  border-width: 0px;
}

@media (max-width: 700px) {
  * {
    font-size: 103%;
  }
}

.v-head-cloned {
  display-: none;
}

.v-menubar>li>a {
  padding: 10px;
}

.loading {
  background: url(./cdn/images/loading.svg) no-repeat top center;
}

.ui-panel>.v-widget-content>form>center:last-child {
  position: sticky;
  bottom: 0;
  background-color: #0f62ac;
  border-top: 1px solid gray;
  padding: 10px;
}

input {
  color: black;
}

.v-table th input {
  color: black;
}

.v-table th input:disabled {
  background-color: #dadada !important;
  opacity: 0.5;
}

.v-table>tr>td {
  border: 1px solid lightgrey;
  padding: 2px;
}

.v-table-buttons {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 26px;
  padding: 5px 10px;
}</style>
