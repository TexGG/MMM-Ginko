/* Magic Mirror
 * Module: MMM-Ginko
 *
 * By Tex https://github.com/TexGG/MMM-Ginko
 * MIT Licensed.
 */

const request = require("request");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    getListeTempsUrl: "https://api.ginko.voyage/TR/getListeTemps.do?",
    getLignesUrl: "https://api.ginko.voyage/DR/getLignes.do",
    

    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if(notification === "CONFIG"){
            this.config = payload;
            this.getLines();
            this.getData();
            setInterval(() => {
                this.getData();
            }, this.config.updateInterval * 1000);
        }
    },

    getData: function() {
        var options = {
            url: this.getListeTempsUrl +
            "listeNoms=" + encodeURIComponent(this.config.stations.join("~")) +
            "&listeIdLignes=" + this.config.lines.join("~") +
            "&listeSensAller=" + this.config.directions.join("~") +
            "&nb=" + this.config.max
        };
        
        request(options, (error, response, body) => {
            if (response.statusCode === 200) {
                body = JSON.parse(body);
                if(body.ok) {
                    this.handleData(body.objets);
                } else {
                    console.log("Error no Ginko data");
                }
            } else {
                console.log("Error getting Ginko data " + response.statusCode);
                console.log(options);
            }
        });
    },

    handleData: function(data){
        var stations = {};

        for(var i = 0; i < data.length; i++){
            if(!stations.hasOwnProperty(data[i].nomExact)){
                stations[data[i].nomExact] = {
                    name: data[i].nomExact,
                    departures: []
                };
            }
            for(var n = 0; n < data[i].listeTemps.length; n++){
                stations[data[i].nomExact].departures.push({
                    lineId: data[i].listeTemps[n].idLigne,
                    time: data[i].listeTemps[n].temps,
                    towards: data[i].listeTemps[n].destination,
                    line: data[i].listeTemps[n].numLignePublic,
                    couleurFond: data[i].listeTemps[n].couleurFond,
                    couleurTexte: data[i].listeTemps[n].couleurTexte,
                    fiable: data[i].listeTemps[n].fiable
                });
            }
        }

        this.sendSocketNotification("STATIONS", stations);
    },
    
    getLines: function(){
        var options = {
            url: this.getLignesUrl
        };
        request(options, (error, response, body) => {
            if (response.statusCode === 200) {
                body = JSON.parse(body);
                if(body.ok) {
                    this.setLines(body.objets);
                } else {
                    console.log("Error no Ginko data");
                }
            } else {
                console.log("Error getting Ginko data " + response.statusCode);
            }
        });
    },
    
    setLines: function(data){
        var lines = {};
        
        for(var i = 0; i < data.length; i++){
            lines[data[i].id] = {
                libellePublic: data[i].libellePublic,
                numLignePublic: data[i].numLignePublic,
                modeTransport: data[i].modeTransport,
                couleurFond: data[i].couleurFond,
                couleurTexte: data[i].couleurTexte,
                variantes: data[i].variantes
            };
        }
        
        this.sendSocketNotification("LINES", lines);
    }
});