/*
 * generating a line graph of multipile parties with multiple dates...
 * Aussehen und Verhalten kommen aus charts.js (VIZ.line); dieser Aufruf bleibt für die Szenen (Bibliothek) gleich:
 * d3.select('#svg').datum(records).call(d3.linegraph(...)) zeichnet an die Stelle des SVG.
 * */

d3.linegraph = function(noTicks, noDots, parties, partyColors, partyNames, dataMax, dataMin) {
    /* params */
    if (!parties) {
        parties = ['spd', 'linke', 'gruene', 'union', 'fdp', 'bsw', 'afd', 'other'];
    }
    if (!partyColors) {
        partyColors = {'spd': '#E3000F', 'linke': '#BE3075', 'gruene': '#46962B', 'union': '#151518', 'fdp': '#E6C800', 'bsw': '#7D254F', 'afd': '#009EE0', 'other': '#a0a0a0'};
    }
    if (!partyNames) {
        partyNames = {'spd': 'SPD', 'linke': 'Linke', 'gruene': 'Grüne', 'union': 'CDU/CSU', 'fdp': 'FDP', 'bsw': 'BSW', 'afd': 'AfD', 'other': 'Sonstige'};
    }

    var width = 500;
    var height = 400;

    function linegraph(dataset) {
        dataset.each(function(data) {
            var svg = this;
            var box = svg.nextElementSibling;
            if (!box || !box.classList.contains('viz')) {
                box = document.createElement('div');
                box.className = 'viz viz_card';
                svg.parentNode.insertBefore(box, svg.nextSibling);
            }
            svg.style.display = 'none';
            var times = data.map(function(d) { return new Date(d.date).getTime(); });
            VIZ.line(box, {
                time: true,
                width: width,
                height: Math.min(height, 300),
                legend: 'values',
                dots: !noDots,
                xTicks: noTicks ? undefined : times,
                xFormat: function(t) { return d3.timeFormat(noTicks ? '%b %y' : '%Y')(new Date(t)); },
                title: function(t) { return d3.timeFormat('%b %Y')(new Date(t)); },
                yDomain: dataMax ? [dataMin, dataMax] : undefined,
                value: function(v) { return VIZ.num(v, 1) + ' %'; },
                series: parties.map(function(p) {
                    return {key: p, name: partyNames[p] || p,
                            color: p == 'union' ? 'var(--party-union)' : partyColors[p],
                            points: data.map(function(d, i) { return [times[i], d[p]]; })};
                })
            });
        });
    }

    linegraph.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return linegraph;
    };

    linegraph.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return linegraph;
    };

    linegraph.parties = function(value) {
        if (!arguments.length) return parties;
        parties = value;
        return linegraph;
    };

    linegraph.partyNames = function(value) {
        if (!arguments.length) return partyNames;
        partyNames = value;
        return linegraph;
    };

    linegraph.partyColors = function(value) {
        if (!arguments.length) return partyColors;
        partyColors = value;
        return linegraph;
    };

    return linegraph;
};
