<template>
    <ion-content :scroll-events="true">
        <v-form header="Proyectos" action="/admin/bpm/project"> 
            <v-table 
                :selectable="true" 
                @loaded="tableLoaded"
                row-style-class="row.physicalAdvance>=100?'blue':(row.physicalAdvance>row.scheduledAdvance?'green':(!row.scheduledAdvance||0>=row.scheduledAdvance?'':'red'))"
                :scrollable="true" :pagination="20"
                :filters="filters" src="/api/project"> 
            <template v-slot:header="">
                <v-button value="Crear" icon="fa-plus" 
                    class="on" @click.prevent="create"></v-button>
                <v-button value="Editar" icon="fa-pen" 
                    @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                <v-button value="Atender" v-if="1||can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-pen" 
                    @click.prevent="attend" :disabled="!rowSelectedCount"></v-button>
                <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])" 
                    :disabled="!rowSelectedCount"></v-button>
                <v-button value="Eliminar" v-if="1||can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-trash"
                    @click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
                <v-button value="Reporte" icon="fa-download"
                    @click.prevent="download" :disabled="!rowSelectedCount"></v-button>
                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button> 

<v-uploader  v-on:input="upload" value="Import"/>
                <v-button icon="fa-tasks" v-on:click.prevent="manage(0)" v-bind:disabled="!rowSelectedCount" value="Manage"/>
                <v-button icon="fa-chart-line" v-if="CAN_SUPERVISE||CAN_ADMIN" v-on:click.prevent="progress" v-bind:disabled="!rowSelectedCount" value="Supervise"/>
            </template> 
            <template v-slot="{row,index}">
                <td class="center" header="#" width="39" >
                    {{pad(index+1,3)}}
                </td>
                <td width="100" header="ESTADO PROCESO" >
                    <v-filter>
                        <input v-model="filters.estadoProceso"/>
                    </v-filter>
                    {{row.estadoProceso}}
                </td>
                <td width="300" v-bind:title="row.id" header="Descripción">
                    <v-filter>
                        <input v-model="filters.description"/>
                    </v-filter>
                    <a v-on:click="go" v-bind:href="'/admin/project/project/'+row.id">{{row.description}}</a>
                </td>
                 <td width="300" v-bind:title="row.id" header="Observaciones">
                    <v-filter>
                        <input v-model="filters.comment"/>
                    </v-filter>
                    {{row.comment}}
                </td>
                <td width="100" v-bind:title="row.id" header="Tipo Cuaderno">
                    <v-filter>
                        <input v-model="filters.notebookType"/>
                    </v-filter>
                    {{row.notebookType}}
                </td>
                <td width="200" v-bind:title="row.activityId" header="#{bundle.Activity}">
                    <v-filter>
                        <input v-model="filters.activity"/>
                    </v-filter>
                    {{row.activity}}
                    <template v-if="row.ext&&row.ext.dispatch">
                        , DESDE EL {{row.ext.dispatch.insertDate|date}} 
                    </template>

                </td>
                <td width="200" header="Dependency">
                    <v-filter>
                        <input v-model="filters.dependency"/>
                    </v-filter>
                    {{row.dependency}}
                </td>
                <td width="80" header="CUI" class="center" >
                    <v-filter>
                        <input maxlength="8" class="numeric center" style="text-align: center" v-model="filters.cui"/>
                    </v-filter>
                    <a target="_new" v-bind:href="'https://ofi5.mef.gob.pe/invierte/formato/verProyectoCU/'+row.cui">{{row.cui}}</a>
                </td>
                <td width="80" header="INFOBRAS" class="center" >
                    <v-filter>
                        <input maxlength="8" class="center numeric" v-model="filters.infobras"/>
                    </v-filter>
                    <a target="_new" v-bind:href="'https://apps.contraloria.gob.pe/ciudadano/wfm_obras_mostrar_1.aspx?ID='+row.infobrasCode">{{row.infobras}}</a>
                </td>
                <td width="80" header="bundle.SNIP" class="center" >
                    <v-filter>
                        <input maxlength="8" class="center numeric" v-model="filters.snip"/>
                    </v-filter>
                    <a target="_new" v-bind:href="'http://ofi4.mef.gob.pe/bp/ConsultarPIP/frmConsultarPIP.asp?accion=consultar&amp;txtCodigo='+row.snip">{{row.snip}}</a>

                </td>
                <td width="100" header="Infrastructures" class="center">
                    <v-filter>
                        <input disabled="disabled" v-model="filters.infrastructures"/>
                    </v-filter>
                    {{row.infrastructures}}
                </td>
                <td width="200" header="Province" >
                    <v-filter>
                        <input v-model="filters.province"/>
                    </v-filter>
                    {{row.province}}
                </td>
                <td width="200" header="Rubro Financiamiento" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.rubroFinanciamiento"/>
                    </v-filter>
                    {{row.rubroFinanciamiento}}
                </td>
                <td width="200" header="Cadena Funcional" >
                    <v-filter>
                        <input v-model="filters.cadenaFuncional"/>
                    </v-filter>
                    {{row.cadenaFuncional}}
                </td>
                <td width="200" header="Unidad Ejecutora" >
                    <v-filter>
                        <input v-model="filters.unidadEjecutora"/>
                    </v-filter>
                    {{row.unidadEjecutora}}
                </td>
                <td width="200" header="Unidad Formuladora" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.unidadFormuladora"/>
                    </v-filter>
                    {{row.unidadFormuladora}}
                </td>
                <td width="300" header="Contratista" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.contratista"/>
                    </v-filter>
                    {{row.contratista}}
                </td>
                <td width="100" header="RUC" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.ruc"/>
                    </v-filter>
                    {{row.ruc}}
                </td>
                <td width="200" header="Tipo Proceso" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.tipoProceso"/>
                    </v-filter>
                    {{row.tipoProceso}}
                </td>

                <td width="300" header="Contratos" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.contract"/>
                    </v-filter>
                    {{row.contract}}
                </td>
                <td width="80" class="center" header="Plazo Ejecución Cuadro" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.limitDate"/>
                    </v-filter>
                    {{row.limitDate}}
                </td>
                <td width="100" header="Plazo Ejecución" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.plazoEjecucion"/>
                    </v-filter>
                    {{row.plazoEjecucion}}
                </td>
                <td width="80" class="center" header="Fecha Inicio" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.startDate"/>
                    </v-filter>
                    {{row.startDate|date}}
                </td>
                <td width="80" class="center" header="Fecha Final" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.endDate"/>
                    </v-filter>
                    {{row.endDate|date}}
                </td>
                <td width="100" header="PIA" class="right">
                    <v-filter>
                        <input disabled="disabled" v-model="filters.pia"/>
                    </v-filter>
                    {{row.pia|number}}
                </td>
                <td width="100" header="PIM" class="right">
                    <v-filter>
                        <input disabled="disabled" v-model="filters.pim"/>
                    </v-filter>
                    {{row.pim|number}}
                </td>
                <td width="100" header="Estado Inversión" >
                    <v-filter>
                        <input v-model="filters.estadoInversion"/>
                    </v-filter>
                    {{row.estadoInversion}}
                </td>
                <td width="400" header="Situación Inversión" >
                    <v-filter>
                        <input disabled="disabled" v-model="filters.investmentSituation"/>
                    </v-filter>
                    {{row.investmentSituation}}
                </td>
                <td width="80" header="Avance Físico (%)" class="right">
                    <v-filter>
                        <input disabled="disabled" v-model="filters.physicalAdvance"/>
                    </v-filter>
                    {{row.physicalAdvance|number}}
                    <div class="center">({{row.physicalAdvanceDate|date}})</div>
                </td>
                <td width="80" header="Avance Programado (%)" class="right">
                    <v-filter>
                        <input disabled="disabled" v-model="filters.scheduledAdvance"/>
                    </v-filter>
                    {{row.scheduledAdvance|number}}
                </td>
                <td width="111" header="DIFERENCIA (% AV. FISICO - % AV. PROGRAMADO)" class="right" >
                    <v-filter>
                        <v-select v-model="filters.diff">
                            <option value="0">TODOS</option>
                            <option value="1">AVANZADOS</option>
                            <option value="-1">ATRASADOS</option>
                            <option value="2">COMPLETADOS</option>
                            <option value="-2">SIN INICIAR</option>
                        </v-select>
                    </v-filter>
                    {{row.physicalAdvance-row.scheduledAdvance|number}}
                </td>


                <td width="100" header="Infobras PIM" class="right">{{row.infobrasPim|number}}</td>
                <td width="100" header="COSTO TOTAL ACTUALIZADO" class="right">{{row.updatedCost|number}}</td>
                <td width="100" header="DEVENGADO ACUMULADO" class="right">{{row.devengadoAcumulado|number}}</td>
                <td width="100" header="SALDO POR DEVENGAR" class="right">
                    <template v-if="!row.updatedCost">
                        {{(row.devengadoAcumulado)|number}}
                    </template>
                    <template v-if="row.updatedCost" >
                        <div>
                            ({{(100.0*(row.updatedCost-row.devengadoAcumulado)/row.updatedCost)|number}}%)
                        </div>
                        {{(row.updatedCost-row.devengadoAcumulado)|number}}
                        <div v-if="row.devengadoAcumulado>row.updatedCost">DEVENGADO ACUM. > COSTO TOTAL ACTUALIZADO</div>
                    </template>
                </td>
                <td width="100" header="Devengado" class="right">{{row.devengadoAcumulado|number}}</td>
                <td width="80" header="ENE" class="right">{{row.m01|number}}</td>
                <td width="80" header="FEB" class="right">{{row.m02|number}}</td>
                <td width="80" header="MAR" class="right">{{row.m03|number}}</td>
                <td width="80" header="ABR" class="right">{{row.m04|number}}</td>
                <td width="80" header="MAY" class="right">{{row.m05|number}}</td>
                <td width="80" header="JUN" class="right">{{row.m06|number}}</td>
                <td width="80" header="JUL" class="right">{{row.m07|number}}</td>
                <td width="80" header="AGO" class="right">{{row.m08|number}}</td>
                <td width="80" header="SEP" class="right">{{row.m09|number}}</td>
                <td width="80" header="OCT" class="right">{{row.m10|number}}</td>
                <td width="80" header="NOV" class="right">{{row.m11|number}}</td>
                <td width="80" header="DIC" class="right">{{row.m12|number}}</td>
                <td width="100" header="Total" class="right">{{row.total|number}}</td>
            </template>
            </v-table>
            
            
        </v-form>
    </ion-content>
</template>
<script>
var {axios,_}=window;
export default _.ui({
    data(){
        return {k:0,rowSelectedCount2:0,page:0,data:[],mode:0,query:null}
    },
    
    created(){
        this.filters.uid=this.user.uid;
        this.$on('sync',function(dr,dl){//data remote -> data local
            if(dr.people&&dl.people){
                dr.people.forEach(pr=>{
                    dl.people.forEach(pl=>{
                        if(pl.tmpId==pr.tmpId){
                            if(pr.id){
                                pl.id=pr.id;
                                pl.tmpSynchronized=1;
                            }
                            if(pr.encuesta_id){
                                pl.encuesta_id=pr.encuesta_id;
                                pl.parent=pr.encuesta_id;
                            }
                            console.log(pl);
                        }
                    });
                });
            }
        });
    },
    updated(){
        window.app.bindLinks(this.$el);
    },
    methods: {
        getColor(o){return o.color;},
        tableLoaded(e){

            e.target.data.forEach(e=>{
                if(e.activity)this.app.tt(e.activity);
                if(e.ext)
                    e.ext.split('|,').forEach((e2)=>{
                        e2=e2.split('=');
                        if(e[e2[0]]){
                            e[e2[0]]+=', '+e2[1];
                        }else
                            e[e2[0]]=e2[1];
                    });
            });
            this.k++;
        },
        attend(e){
            this.edit(e);
        },
        rss(e){
            e=e.selection;
            this.rowSelectedCount2=e?e.length:0;
        },
        can(o) {
            var m = this, u = m.user;
            return o||u.uid==1;
            /*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
            !o || o.user == u.id;*/
        },
        view(o) {
            this.open('/admin/bpm/run/' + (o.tmpId?(-o.tmpId):o.id));
        },
        view2() {
                    var me = this;
                    var f = me.$children[0];
                    var action = f.action;
                    if (!action)
                        action = window.location.pathname;
                    var t = me.$children[0].$children[0];
                    if (window.app.$router)
                        window.app.$router.push('/admin/project/project/' + t.data[t.selected[0]][t.$attrs.rowkey]);
                    else
                        axios.get((action + '/project/' + t.data[t.selected[0]][t.$attrs.rowkey] + '?modal').replace(/([^:]\/)\/+/g, "$1")).then(me.open).catch(me.error);
                },
                manage(nuevo) {
                    var me = this;
                    var f = me.$children[0];
                    var action = f.action;
                    if (!action)
                        action = window.location.pathname;
                    var t = me.$children[0].$children[0];
                    axios.get((action + '/project/' + (nuevo ? 0 : t.data[t.selected[0]][t.$attrs.rowkey]) + '/manage?modal').replace(/([^:]\/)\/+/g, "$1")).then(me.open).catch(me.error);
                },
                progress() {
                    var me = this;
                    var f = me.$children[0];
                    var action = f.action;
                    if (!action)
                        action = window.location.pathname;
                    var t = me.$children[0].$children[0];
                    axios.get((action + '/project/' + (t.data[t.selected[0]][t.$attrs.rowkey]) + '/progress?modal').replace(/([^:]\/)\/+/g, "$1"))
                            .then(me.open)
                            .catch(me.error);
                },
        toInt(o){
            return Array.isArray(o)?o.length:o;
        },
        download(){
            this.app.download(this.getSelected()[0]);
        }
    }
});
</script>
<style scoped>
	.hg{
            background-color:green !important; 
        }
        .hgd{
            background-color:#005d00 !important; 
        }
        .hr{
            background-color:#bf0000 !important; 
        }
        .hbd{
            background-color:#033d71 !important; 
        }
</style>