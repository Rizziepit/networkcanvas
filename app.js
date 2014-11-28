(function(){
    var app = angular.module("networkcanvas", []);

    Relation = function(source, target) {
        this.source = source;
        this.target = target;
    };

    Entity = function(name, type) {
        this.name = name;
        this.type = type;
    };

    app.controller("NetworkController", function() {
        this.entities = [];
        this.relations = [];

        this.addEntity = function() {
            this.entities.push(new Entity("unnamed", "unknown"));
            if (this.updateCola !== undefined)
                this.updateCola();
        };

        this.addEntity();
        this.addEntity();
        this.addEntity();

        // canvas stuff

        var width = 950;
        var height = 500;
        var nodeWidth = 40;
        var nodeHeight = 40;
        var color = d3.scale.category20();

        this.cola = cola.d3adaptor()
            .linkDistance(120)
            .avoidOverlaps(true)
            .size([width, height]);

        var svg = d3.select("#canvas").append('svg')
            .attr("width", width)
            .attr("height", height);

        this.cola
            .nodes(this.entities)
            .links(this.relations)
            .start();

        var link = svg.selectAll(".link")
            .data(this.relations)
            .enter()
            .append("line")
            .attr("class", "relation");

        var node = svg.selectAll(".node")
            .data(this.entities)
            .enter()
            .append("rect")
            .attr("class", function (d) {return "entity entity-" + d.type;})
            .attr("width", nodeWidth).attr("height", nodeHeight)
            .attr("rx", 5).attr("ry", 5)
            .style("fill", function (d) {return color(1);})
            .call(this.cola.drag);

        var label = svg.selectAll(".label")
            .data(this.entities)
            .enter()
            .append("text")
            .attr("class", "label")
            .text(function (d) {return d.name;})
            .call(this.cola.drag);

        this.cola.on("tick", function() {
            link.attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});

            node.attr("x", function (d) {return d.x - nodeWidth / 2.0;})
                .attr("y", function (d) {return d.y - nodeHeight / 2.0;});

            label.attr("x", function (d) {return d.x;})
                 .attr("y", function (d) {
                     var h = this.getBBox().height;
                     return d.y + h/4;
                 });
        });

    });

})();
