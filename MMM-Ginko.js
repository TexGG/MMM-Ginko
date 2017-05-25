/* Magic Mirror
 * Module: MMM-Ginko
 *
 * By Tex https://github.com/TexGG/MMM-Ginko
 * MIT Licensed.
 */

Module.register("MMM-Ginko", {

    index: 0,

    types: {
        "0": "fa-bus", // Bus
        "1": "fa-train" // Tramway
    },

    defaults: {
        max: 2,
        shortenStation: false,
        shortenDestination: false,
        rotateInterval: 10,
        updateInterval: 30,
        showColored: true
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            de: "translations/de.json",
            fr: "translations/fr.json"
        };
    },

    getScripts: function() {
        return ["https://www.ginkoopenapi.fr/api.js"];
    },

    getStyles: function () {
        return ["font-awesome.css", "MMM-Ginko.css"];
    },

    start: function () {
        Log.log("Starting module: " + this.name);
        moment.locale(config.language);
        this.maxIndex = this.config.stations.length;
        setInterval(() => {
            this.updateDom(300);
            this.index++;
            if(this.index >= this.maxIndex){
                this.index = 0;
            }
        }, this.config.rotateInterval * 1000);
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "STATIONS") {
            this.stations = payload;
            //this.updateDom(300);
        }
        if (notification === "LINES") {
            this.allLines = payload;
        }
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        var header = document.createElement("header");
        header.classList.add("align-left");
        var logo = document.createElement("i");
        logo.classList.add("fa", "fa-bus", "logo");
        header.appendChild(logo);
        var name = document.createElement("span");
        name.innerHTML = "Ginko";
        header.appendChild(name);
        wrapper.appendChild(header);

        // if stations undefined, we are loading
        if (!this.stations) {
            var text = document.createElement("div");
            text.innerHTML = this.translate("LOADING");
            text.classList.add("dimmed", "light");
            wrapper.appendChild(text);
        } else {
            var keys = Object.keys(this.stations);
            this.maxIndex = keys.length;
            
            // if we have stations
            if (this.maxIndex > 0) {
                // if rotation index greater than stations max index
                if(this.index >= this.maxIndex){
                    this.index = 0;
                }
                
                var station_name = this.stations[keys[this.index]].name;
                
                // if shortenStation, cut the station name
                if(this.config.shortenStation && station_name.length > this.config.shortenStation){
                    station_name = station_name.slice(0, this.config.shortenStation) + "&#8230;";
                }
                
                // adding stations name to board
                var station = document.createElement("div");
                station.classList.add("align-left");
                station.innerHTML = station_name;
                wrapper.appendChild(station);
                var table = document.createElement("table");
                table.classList.add("small", "table", "align-left");

                // adding rows labels to board
                table.appendChild(this.createLabelRow());

                // adding all departures to board
                for (var i = 0; i < this.stations[keys[this.index]].departures.length; i++) {
                    this.appendDataRow(this.stations[keys[this.index]].departures[i], table);
                }

                wrapper.appendChild(table);
            } else { // else no traffic
                var text = document.createElement("div");
                text.innerHTML = this.translate("NOTRAFFIC");
                text.classList.add("dimmed", "light");
                wrapper.appendChild(text);
            }
        }

        return wrapper;
    },

    createLabelRow: function () {
        var labelRow = document.createElement("tr");

        var typeIconLabel = document.createElement("th");
        typeIconLabel.classList.add("centered");
        var typeIcon = document.createElement("i");
        typeIcon.classList.add("fa", "fa-info");
        typeIconLabel.appendChild(typeIcon);
        labelRow.appendChild(typeIconLabel);

        var lineIconLabel = document.createElement("th");
        lineIconLabel.classList.add("centered");
        var lineIcon = document.createElement("i");
        lineIcon.classList.add("fa", "fa-tag");
        lineIconLabel.appendChild(lineIcon);
        labelRow.appendChild(lineIconLabel);

        var directionIconLabel = document.createElement("th");
        directionIconLabel.classList.add("centered");
        var directionIcon = document.createElement("i");
        directionIcon.classList.add("fa", "fa-compass");
        directionIconLabel.appendChild(directionIcon);
        labelRow.appendChild(directionIconLabel);

        var timeIconLabel = document.createElement("th");
        timeIconLabel.classList.add("centered");
        var timeIcon = document.createElement("i");
        timeIcon.classList.add("fa", "fa-clock-o");
        timeIconLabel.appendChild(timeIcon);
        labelRow.appendChild(timeIconLabel);

        // add label row to board
        return labelRow;
    },

    appendDataRow: function (data, appendTo) {
        var row = document.createElement("tr");

        // line type icon cell
        var type = document.createElement("td");
        type.classList.add("centered");
        var typeIcon = document.createElement("i");
        // get the line type (bus, tramway, ...) with the line id
        var line_type = this.getType(data.lineId);
        typeIcon.classList.add("fa", this.types.hasOwnProperty(line_type) ? this.types[line_type] : "fa-question");
        type.appendChild(typeIcon);
        row.appendChild(type);

        // line number cell with color
        var line = document.createElement("td");
        line.classList.add("centered");
        line.innerHTML = data.line;
        // if showColored, put color on the cell
        if (this.config.showColored) {
            line.style.color = "#" + data.couleurTexte;
            line.style.backgroundColor = "#" + data.couleurFond;
        }
        row.appendChild(line);

        // destination cell
        var destination_name = data.towards;
        // if shortenDestination, cut the destination name
        if(this.config.shortenDestination && destination_name.length > this.config.shortenDestination){
            destination_name = destination_name.slice(0, this.config.shortenDestination) + "&#8230;";
        }
        var towards = document.createElement("td");
        towards.innerHTML = destination_name;
        row.appendChild(towards);

        // time cell
        var time = document.createElement("td");
        time.classList.add("centered");
        time.innerHTML = data.time;
        // if showColored and data not reliable
        if (this.config.showColored && !data.fiable) {
            time.style.color = "red";
        }
        row.appendChild(time);

        // add row to board
        appendTo.appendChild(row);
    },
    
    getType: function(lineId) {
        // if lines collected
        if (!this.allLines) {
            return -1;
        } else {
            // return type of the line in parameter
            return this.allLines[lineId].modeTransport;
        }
    }
});
