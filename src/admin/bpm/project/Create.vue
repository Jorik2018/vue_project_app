<template>
  <v-form
    action="/api/project/"
    :header="(dispatch ? 'Editar' : o.id ? 'Editar' : 'Crear') + ' Proyecto'"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    store="project"
  >
    
      <div class="v-form">
            <label>Descriptión:</label>
            <v-textarea v-model="o.description" maxlength="255"  />
                        <label>Observaciones:</label>
            <v-textarea v-model="o.comment" maxlength="255" />
                         <label>Tipo cuaderno:</label>
            <input v-model="o.notebookType" />
            <label>Código Unico de Inversión (CUI):</label>
            <input type="tel"  v-model="o.cui" maxlength="8" class="center numeric" title="CUI}" />
            <div v-if="o.cui" class="right" style="margin-top: 10px;">
                <v-button icon="fa-sync" value="SISTEMA SEGUIMIENTO DE INVERSIONES (SSI)" v-on:click.prevent="listInfoSiaf(o)"/>
            </div>
            <v-fieldset v-if="infoSNIP" legend="Ejecución Financiera">
                <template v-for="(v,k) in infoSNIP[0]" >
                    <div v-if="v" v-bind:key="k">
                        <label>{{k}}:</label>
                        <div>
                            {{v}}
                        </div>
                    </div>
                </template>
            </v-fieldset>
            <v-fieldset v-if="infoSIAF" legend="Banco de Inversiones">
                <template v-for="(v,k) in infoSIAF[0]" >
                    <div v-if="v" v-bind:key="k">
                        <label>{{k}}:</label>
                        <div>
                            {{v}}
                        </div>
                    </div>
                </template>
            </v-fieldset>
            <label>Provincia:</label>
            <input v-model="o.province" maxlength="200" />
            <label>SISGEDO:</label>
            <input type="tel"  v-model="o.sisgedo" maxlength="8" class="center numeric" />
            <div v-if="o.sisgedo" class="right" style="margin-top: 10px;">
                <a target="_NEW" v-bind:href="'http://sisgedo.regionancash.gob.pe/sisgedonew/reports/tramitereporte.php?_expe_id='+o.sisgedo">VER TRAMITE DE EXPEDIENTE</a>
            </div>
            <label>SNIP:</label>
            <input type="tel"  v-model="o.snip" maxlength="8" class="center numeric" title="SNIP}" />
            <div v-if="o.snip" class="right" style="margin-top: 10px;">
                <v-button icon="fa-sync" value="Mostrar Informacion MEF" v-on:click.prevent="listInfoObras(o)"/>
            </div>
            <v-fieldset v-if="infoObras" legend="Información Obras">
                <template v-for="(v,k) in infoObras[0]">
                    <div v-if="v" v-bind:key="k">
                        <label>{{k}}:</label>
                        <div v-if="k!='Avances'">{{v}}</div>
                        <v-table v-if="k=='Avances'" v-bind:value="v">
                            <template v-slot:default="{row}">
                                <td class="center" label="Periodo">
                                    {{row.Periodo}}
                                </td>
                                <td class="right" label="AvValAcumReal (AvFisAcumReal)">
                                    {{row.AvValAcumReal}}
                                    <div>({{row.AvFisAcumReal}} %)</div>
                                </td>
                                <td class="right" label="AvValAcumProg (AvFisAcumProg)">
                                    {{row.AvValAcumProg}}
                                    <div>({{row.AvFisAcumProg}} %)</div>
                                </td>
                            </template>
                        </v-table>
                        <v-chart v-if="k=='Avances'" type="line" v-bind:data-func="chartDataFunc" style="height:300px;margin-top: 10px;"/>
                    </div>
                </template>
            </v-fieldset>
            <label>INFOBRAS:</label>
            <input type="tel"  v-model="o.infobras" maxlength="8" class="center numeric" title="INFOBRAS}" />
            <label>Estado Inversión:</label>
            <input v-model="o.estadoInversion" maxlength="200" />
            <label>Unidad Ejecutora:</label>
            <v-textarea v-model="o.unidadEjecutora" maxlength="200" />
            <label>Cadena Funcional:</label>
            <v-textarea v-model="o.cadenaFuncional" maxlength="200" />
            <label>Supervicion:</label>
            <input v-model="o.supervicion" />
            <label>Residente:</label>
            <input v-model="o.residente" />
            <label>Coordinador:</label>
            <input v-model="o.coordinadorObra" />
            <label>Monto Valorizado:</label>
            <input type="tel"  v-model="o.montoValorizado" class="numeric" />
            <label>Saldo Valorizar:</label>
            <input type="tel"  v-model="o.saldoValorizar" class="numeric" />
            
            <label>Cofinanciamiento:</label>
            <input type="tel"  v-model="o.cofinanciamiento" class="numeric" />
            <label>AporteAeo:</label>
            <input type="tel"  v-model="o.aporteAeo" class="numeric" />
            <v-fieldset legend="SISTEMA DE SEGUIMIENTO DE INVERSIONES">
                <label>Avance Físico (%):</label>
                <input v-model="o.physicalAdvance" max="100" min="0" class="center numeric" />
                <label>Avance Programado (%):</label>
                <input v-model="o.scheduledAdvance" max="100" min="0" class="center numeric" />
                <label>Infobras PIM:</label>
                <input v-model="o.scheduledAdvance" min="0" class="center numeric" />
                <label>Costo Total Actualizado:</label>
                <input v-model="o.scheduledAdvance" min="0" class="center numeric" />
                <label>Devengado Acumulado:</label>
                <input v-model="o.devengadoAcumulado" min="0" class="center numeric" />
                <label>Saldo Devengar:</label>
                <input v-model="o.saldoDevengar" min="0" class="center numeric" />
            </v-fieldset>
            <v-fieldset legend="CONSULTA AMIGABLE" class="v-form">
                <label>PIA:</label>
                <input v-model="o.pia" min="0" class="center numeric" />
                <label>PIM:</label>
                <input v-model="o.pim" min="0" class="center numeric" />
                <label>Certificación:</label>
                <input v-model="o.certification" min="0" class="center numeric" />
                <label>Acumulado:</label>
                <input v-model="o.accrued" min="0" class="center numeric" />
            </v-fieldset>
            
            <label>Responsable:</label>
            <v-textarea v-model="o.responsable" maxlength="255" rows="1" />
            <v-fieldset legend="Infrastructuras">
                <div style="border:1px solid gray;padding:5px" v-bind:key="row.id" v-for="row in o.ext.infrastructures">
                    <b>{{row.infrastructureType.name}}: {{row.name}}</b>
                    <div v-if="row.ext">JURIDICCIÓN: {{row.ext[3]}} / {{row.ext[1]}}</div>
                    <div class="right"><v-button icon="fa-trash"/></div>
                </div>
                <label>Buscar:</label>
                <v-autocomplete placeholder="Ingrese mas de 2 letras y presione ENTER" 
                                ref="infrastructureAutocomplete"
                                v-bind:show-selection="false"
                                v-bind:params="{name:$refs.infrastructureAutocomplete?$refs.infrastructureAutocomplete.query:null,type:2}"
                                inputClass="center"
                                v-on:input="infrastructureAutocompleteInput"
                                minQueryLength="3"
                                src="/admin/project/api/infrastructure"
                                label="2">
                    <template v-slot="{row}">
                        <b>{{row.infrastructureType.name}}: {{row.name}}</b>
                        <div>JURIDICCIÓN: {{row.ext[3]}} / {{row.ext[1]}}</div>
                    </template>
                </v-autocomplete>
            </v-fieldset>

            <v-fieldset legend="Imagenes" >
                <div>
                    <div v-for="(f,i) in o.ext.galleryList" v-bind:key="i">
                        <img onerror="this.src='/fs/images/IMAGE.png'" style="border: 1px solid gray;
                             width: calc(100% - 2px);" width="100%" v-bind:src="'/fs/'+(f.tempFile?('temp/'+f.tempFile):f.file.filepath)"/>
                        <v-textarea v-model="f.description" maxlength="225" style=" margin-bottom: 10px"/>
                    </div>
                </div>
                <div class="right">
                    <v-uploader icon="fa-image" v-on:input="upload" value="Adjuntar Imagen"/>
                </div>
            </v-fieldset>
        </div>
  
    <center>
      <v-button
        value="Grabar"
        icon="fa-save"
        class="blue"
        @click.prevent="save"
      ></v-button>
      <v-button
        style="margin-left: 10px"
        value="Ver"
        :disabled="!o.id"
        icon="fa-eye"
        class="blue"
        @click.prevent="
          $router.replace('/admin/bpm/run/' + (o.tmpId ? -o.tmpId : o.id))
        "
      ></v-button>
    </center>
  </v-form>
</template>
<script>
import "ol/ol.css";
var axios = window.axios;
var _ = window._;
export default _.ui({
  props: ["id", "dispatch"],
  data() {
    return {
      count: 0,
      red: [],
      key2: 0,
      areaResidencia: [
        { id: "U", name: "URBANO" },
        { id: "M", name: "URBANO MARGINAL" },
        { id: "R", name: "RURAL" },
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        activity: {},
        synchronized: null,
        fields: [],

        lat: null,
        tmpId: null,
        lon: null,
        red: null,
        microred: null,
        ext: { src: null },
        agreements: [],
        peoples: [],
      },infoSNIP: null, infoSIAF: null, infoObras: null
    };
  },
  mounted() {
    var me = this;
    me.changeRoute();
  },
  methods: {
    buscarReniec(n, e) {
      var me = this;
      axios.post("/api/reniec/", { dni: n }).then((r) => {
        var p = r.data;
        if (p.coResultado == "0000") {
          p = p.datosPersona;
          e({
            fullName: p.apPrimer + " " + p.apSegundo + " " + p.prenombres,
            address: p.direccion + " - " + p.ubigeo,
            delete:null
          });
        } else {
          me.MsgBox(p.deResultado);
        }
      });
    },
    addPeople(p) {
      var me = this,
        peoples = me.o.peoples;
      if (peoples.filter((e) => e.code == p.code).length)
        me.MsgBox(p.fullName + " ya esta incluido en el expediente!");
      else peoples.push(p);
    },
    process(o) {
        console.log(o);
      return o;
    },
    log(o) {
      console.log(o);
    },
    changeRoute() {
      var me = this;
      if (me.dispatch) {
        axios.get("/api/bpm/dispatch/" + me.dispatch).then(function (response) {
          var o = response.data,
            peoples = [],
            fields = [],
            added = false,
            i = 0;
          o.activity.fields.forEach((e) => {
            if (e.type == "D" && e.value) {
              const [year, month, day] = e.value.split("-");
              e.value = new Date(+year, +month - 1, +day).getTime();
            }
            if (e.name == "dni_infractor") {
              if (e.dispatchFieldId)
                peoples.push({ id: e.dispatchFieldId, code: e.value ,delete:null});
            } else if (e.name == "caso_infractor") {
              if (e.dispatchFieldId) {
                peoples[i].nid = e.dispatchFieldId;
                peoples[i].fullName = e.value;
              }

              if (!added) {
                delete e.value;
                fields.push(e);
                added = 1;
              }
              i++;
            } else if (e.name == "domicilio_infractor") {
              if (e.dispatchFieldId) {
                peoples[i - peoples.length].aid = e.dispatchFieldId;
                peoples[i - peoples.length].address = e.value;
              }

              i++;
            } else fields.push(e);
          });
          o.ext = {};
          o.peoples = peoples;
          console.log(peoples);
          console.log(fields);
          o.activity.fields = fields;
          me.o = o;
          me.key2++;
        });
      } else if (me.id) {
        axios.get("/api/project/" + me.id).then((response) => {
          var o = response.data;
          /*o.activity.fields.forEach((e) => {
            e.value = "";
          });*/
          o.ext = o.ext||{};
          o.peoples = [];
          o.ext.galleryList = o.ext.galleryList||[];
          if (o.ext.activity)
              delete o.ext.activity;
          me.o = o;
          me.key2++;
        });
      } else
        axios.get("/api/project/prepare/1").then(function (response) {
          var o = response.data;
          o.activity.fields.forEach((e) => {
            e.value = "";
          });
          o.ext = {};
          o.peoples = [];
          me.o = o;
          me.key2++;
        });
    },
    close() {
      var me = this;
      me.$router.replace("/admin/bpm/project");
    },
    chartDataFunc(){
                    var labels=[];
                    var data=[[],[]];
                    var items=this.infoObras[0].Avances;
                    for(var i=0;items.length>i;i++){
                        labels.push(items[i].Periodo);
                        data[0].push(items[i].AvFisAcumProg);
                        data[1].push(items[i].AvFisAcumReal);
                    }
                    return {
                        data:{
                            labels:labels,
                            datasets:[
                                {label:'Programado',data:data[0],borderColor: "rgba(0,0,250,1)",fill:false},
                                {label:'Ejecutado',data:data[1],borderColor: "rgba(250,0,0,1)",fill:false}
                            ]
                        },
                        options: {
                            tooltips: {
                                mode: 'label',
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Periodo'
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Valor (%)'
                                    }
                                }]
                            }
                        }
                    };
                },
                upload(v) {
                    v.description = '[' + _.toDate(new Date()) + ']: ' + v.fileName;
                    this.o.ext.galleryList.push(v);
                },
                infrastructureAutocompleteInput(v) {
                    v.action = 1;
                    this.o.ext.infrastructures.push(v);
                },
                listInfoSiaf(o) {
                    var me = this;
                    axios.get("/admin/project/api/project/sync?option=0&amp;code=" + o.cui).then(function (r) {
                        var d = r.data;
                        if (d.d) {
                            d = JSON.parse(d.d);
                            me.infoSNIP = d;
                            me.snip = d.CodigoSnip;
                            
                        } else
                            d = 'NO EXISTE INFORMACIÓN';
                    });
                    axios.get("/admin/project/api/project/sync?option=2&amp;code=" + o.cui).then(function (r) {
                        var d = r.data;
                        if (d.d) {
                            d = JSON.parse(d.d);
                            me.infoSIAF = d;
                            me.snip = d.CodigoSnip;
                            
                        } else
                            d = 'NO EXISTE INFORMACIÓN';
                    });
                },
                listInfoObras(o) {
                    var me = this;
                    axios.get("/admin/project/api/project/sync?option=1&amp;code=" + o.snip).then(function (r) {
                        var d = r.data;
                        if (d.d){
                            d = JSON.parse(d.d);
                        }else
                            d = 'NO EXISTE INFORMACIÓN';
                        me.infoObras = d;
                    });
                }
  },
});
</script>