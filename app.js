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


        /* Canvas setup */

        var width = 950;
        var height = 500;
        var nodeWidth = 40;
        var nodeHeight = 40;
        var color = d3.scale.category20();
        this.entities.push(new Entity("unnamed", "unknown"));
        var _cola = cola.d3adaptor()
            .linkDistance(120)
            .avoidOverlaps(true)
            .size([width, height]);

        _cola
            .nodes(this.entities)
            .links(this.relations)
            .start();

        var svg = d3.select("#canvas").append('svg')
            .attr("width", width)
            .attr("height", height);

        _cola.on("tick", function() {
            var entity = svg.selectAll(".entity");
            var relation = svg.selectAll(".relation");
            var label = svg.selectAll(".label");

            relation.attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});

            entity.attr("x", function (d) {return d.x - nodeWidth / 2;})
                .attr("y", function (d) {return d.y - nodeHeight / 2;});

            label.attr("x", function (d) {return d.x;})
                 .attr("y", function (d) {
                     var h = this.getBBox().height;
                     return d.y + h/4;
                 });
        });


        /* Functions to manipulate relations and entities */

        this.addEntity = function() {
            this.entities.push(new Entity("unnamed", "unknown"));

            if (svg !== undefined) {
                var entity = svg.selectAll(".entity");
                var label = svg.selectAll(".label");
                entity
                    .data(this.entities)
                    .enter()
                    .append("rect")
                    .attr("class", function (d) {return "entity entity-" + d.type;})
                    .attr("width", nodeWidth).attr("height", nodeHeight)
                    .attr("rx", 5).attr("ry", 5)
                    .style("fill", function (d) {return color(1);})
                    .call(_cola.drag);
                label
                    .data(this.entities)
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .text(function (d) {return d.name;})
                    .call(_cola.drag);
                _cola.start();
            }
        };


        this.addRelation = function(source, target) {
            this.relations.push(new Relation(source, target));

            if (svg !== undefined) {
                var relation = svg.selectAll(".relation");
                relation
                    .data(this.relations)
                    .enter()
                    .append("line")
                    .attr("class", "relation");
                _cola.start();
            }
        };

    });

})();
