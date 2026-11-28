/* Gemeinsames Liniendiagramm für Seitenleiste und Bibliothek (Farben und Aussehen: game.css, „Diagramme“).
 *
 * VIZ.line(container, {
 *     series: [{key, name, short, color, points: [[x, y], ...], dash, bold, dot, digits, range, estTo}],
 *                              estTo: Werte bis einschließlich x sind geschätzt („≈“ im Tooltip)
 *     time: true,              x sind Zeitstempel in ms (sonst Zahlen, z. B. Jahre)
 *     height, yDomain, xDomain, xTicks: [..], xFormat(x), yFormat(v),
 *     title(x),                Kopfzeile im Tooltip
 *     value(v, series),        Wert im Tooltip und in der Legende
 *     snap(x),                 Zeitpunkt für den Tooltip (Standard: nächster Datenpunkt)
 *     legend: true | 'values' | false,
 *     focus: key, onFocus(key) hervorgehobene Reihe (Klick in der Legende),
 *     area: true,              Fläche unter der einzigen bzw. hervorgehobenen Reihe
 *     dots: true,              Punkt je Wert (wenige Werte, z. B. Wahlen)
 *     past: {to: x, label},    hinterlegter Bereich (Werte vor dem Spielstart)
 *     marks: [{x, y, color, text}], unit, label (aria)
 *     anchors: [{x, label, values: {key: v}}]  einzelne belegte Werte ohne Verlauf (z. B. Wahltagsbefragungen):
 *                              offene Punkte in der Farbe der Reihe, nicht mit der Linie verbunden
 * })
 */
window.VIZ = (function() {
    var uid = 0;
    var num = function(v, digits) {
        return (v < 0 ? '−' : '') + Math.abs(v).toFixed(digits || 0).replace('.', ',');
    };
    var has = function(v) { return v !== null && v !== undefined && !isNaN(v); };

    // Wert einer Reihe an der Stelle x, linear zwischen den Punkten; null außerhalb
    var at = function(pts, x, slack) {
        if (!pts.length || x < pts[0][0] - slack || x > pts[pts.length - 1][0] + slack) return null;
        if (x <= pts[0][0]) return pts[0][1];
        for (var i = 1; i < pts.length; i++) {
            if (x <= pts[i][0]) return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0] || 1);
        }
        return pts[pts.length - 1][1];
    };

    function line(container, o) {
        var root = d3.select(container);
        root.selectAll('*').remove();
        root.classed('viz', true);
        var series = o.series.map(function(s) {
            return Object.assign({}, s, {points: s.points.filter(function(d) { return has(d[1]); })});
        }).filter(function(s) { return s.points.length; });
        if (!series.length) return;
        var focus = series.some(function(s) { return s.key === o.focus; }) ? o.focus : null;
        var value = o.value || function(v, s) { return num(v, s.digits); };
        var yFormat = o.yFormat || function(v) { return num(v, v % 1 ? 1 : 0); };

        var setFocus = function(key) {
            focus = focus === key ? null : key;
            if (o.onFocus) o.onFocus(focus);
            o.focus = focus;
            line(container, o);
        };

        if (o.legend !== false && series.length > 1) {
            var ordered = o.legend === 'values' ? series.slice().sort(function(a, b) {
                return b.points[b.points.length - 1][1] - a.points[a.points.length - 1][1];
            }) : series;
            var item = root.append('div').attr('class', 'viz_legend').selectAll('button').data(ordered).enter().append('button')
                .attr('type', 'button')
                .attr('class', function(s) { return 'viz_key' + (focus === null ? '' : focus === s.key ? ' sel' : ' dim'); })
                .attr('aria-pressed', function(s) { return focus === s.key; })
                .on('click', function(ev, s) { setFocus(s.key); });
            item.append('i').attr('class', function(s) { return s.dash ? 'dashed' : null; }).style('color', function(s) { return s.color; });
            item.append('span').text(function(s) { return s.name; });
            if (o.legend === 'values') {
                item.append('b').text(function(s) { return value(s.points[s.points.length - 1][1], s); });
            }
        }
        if (o.unit) root.append('div').attr('class', 'viz_unit').text(o.unit);

        var plot = root.append('div').attr('class', 'viz_plot');
        var width = container.clientWidth ? plot.node().clientWidth : (o.width || 320);
        width = Math.max(220, width || o.width || 320);
        var height = o.height || Math.min(300, Math.max(200, Math.round(width * 0.55)));

        var all = [];
        series.forEach(function(s) { all = all.concat(s.points); });
        var anchors = (o.anchors || []).filter(function(a) { return a && a.values; });
        var anchorAt = {};
        anchors.forEach(function(a) {
            anchorAt[a.x] = a;
            series.forEach(function(s) { if (has(a.values[s.key])) all.push([a.x, a.values[s.key]]); });
        });
        var xDom = o.xDomain || d3.extent(all, function(d) { return d[0]; });
        if (xDom[0] === xDom[1]) { var pad = o.time ? 30 * 864e5 : 0.5; xDom = [xDom[0] - pad, xDom[1] + pad]; }
        var visible = all.filter(function(d) { return d[0] >= xDom[0] && d[0] <= xDom[1]; });
        var yDom = o.yDomain;
        if (!yDom) {
            var lo = d3.min(visible, function(d) { return d[1]; }), hi = d3.max(visible, function(d) { return d[1]; });
            (o.marks || []).forEach(function(m) { hi = Math.max(hi, m.y); });
            yDom = [Math.min(0, lo), hi + (hi - Math.min(0, lo)) * 0.08];
        }
        var y = d3.scaleLinear(yDom, [0, 1]).nice(5);
        var ticks = y.ticks(5);
        var m = {top: 8, right: 10, bottom: 24, left: 10 + 7 * d3.max(ticks, function(t) { return yFormat(t).length; })};
        y.range([height - m.bottom, m.top]);
        var x = (o.time ? d3.scaleTime : d3.scaleLinear)(xDom, [m.left, width - m.right]);

        var svg = plot.append('svg').attr('width', width).attr('height', height).attr('role', 'img').attr('aria-label', o.label || 'Liniendiagramm');
        var clip = 'viz_clip' + (++uid);
        svg.append('defs').append('clipPath').attr('id', clip).append('rect')
            .attr('x', m.left - 5).attr('y', 0).attr('width', width - m.left - m.right + 10).attr('height', height - m.bottom + 4);

        if (o.past && o.past.to > xDom[0]) {
            // Zeit vor dem Spielstart fein schraffiert wie in einer gedruckten Statistik
            var px = Math.min(x(o.past.to), width - m.right), hatch = clip + '_hatch';
            svg.select('defs').append('pattern').attr('id', hatch).attr('width', 5).attr('height', 5)
                .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(45)')
                .append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 5).style('stroke', 'var(--viz-hatch)').attr('stroke-width', 1.2);
            svg.append('rect').attr('x', m.left).attr('y', m.top).attr('fill', 'url(#' + hatch + ')')
                .attr('width', Math.max(0, px - m.left)).attr('height', height - m.top - m.bottom);
            svg.append('line').attr('class', 'viz_grid').attr('x1', px).attr('x2', px).attr('y1', m.top).attr('y2', height - m.bottom);
            if (o.past.label && px - m.left > 56) {
                svg.append('text').attr('class', 'viz_past_label').attr('x', m.left + 6).attr('y', m.top + 12).text(o.past.label);
            }
        }

        var yg = svg.append('g').attr('class', 'viz_axis');
        ticks.forEach(function(t) {
            yg.append('line').attr('class', t === 0 && y.domain()[0] < 0 ? 'viz_zero' : 'viz_grid')
                .attr('x1', m.left).attr('x2', width - m.right).attr('y1', y(t)).attr('y2', y(t));
            yg.append('text').attr('x', m.left - 7).attr('y', y(t) + 3.5).attr('text-anchor', 'end').text(yFormat(t));
        });

        var count = Math.max(2, Math.floor((width - m.left - m.right) / 62));
        var xt = o.xTicks ? o.xTicks.filter(function(t) { return t >= xDom[0] && t <= xDom[1]; }) : x.ticks(count);
        if (o.xTicks && xt.length > count) {
            var step = Math.ceil(xt.length / count);
            xt = xt.filter(function(t, i) { return (xt.length - 1 - i) % step === 0; });
        }
        var xFormat = o.xFormat || (o.time ? x.tickFormat(count) : d3.format('d'));
        var xg = svg.append('g').attr('class', 'viz_axis');
        if (y.domain()[0] >= 0) {
            xg.append('line').attr('class', 'viz_base').attr('x1', m.left).attr('x2', width - m.right).attr('y1', height - m.bottom).attr('y2', height - m.bottom);
        }
        xt.forEach(function(t) {
            var tx = x(t), anchor = tx > width - 22 ? 'end' : tx < m.left + 14 ? 'start' : 'middle';
            xg.append('text').attr('x', tx).attr('y', height - 7).attr('text-anchor', anchor).text(xFormat(t));
        });

        var path = d3.line().x(function(d) { return x(d[0]); }).y(function(d) { return y(d[1]); });
        var g = svg.append('g').attr('clip-path', 'url(#' + clip + ')');
        var filled = o.area ? (series.length === 1 ? series[0] : series.filter(function(s) { return s.key === focus; })[0]) : null;
        if (filled) {
            var gid = clip + '_fill';
            var grad = svg.select('defs').append('linearGradient').attr('id', gid).attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', 1);
            grad.append('stop').attr('offset', '0%').style('stop-color', filled.color).style('stop-opacity', 0.22);
            grad.append('stop').attr('offset', '100%').style('stop-color', filled.color).style('stop-opacity', 0);
            g.append('path').attr('fill', 'url(#' + gid + ')')
                .attr('d', d3.area().x(function(d) { return x(d[0]); }).y0(y(Math.max(0, y.domain()[0]))).y1(function(d) { return y(d[1]); })(filled.points));
        }
        // die hervorgehobene Reihe zuletzt zeichnen, damit sie oben liegt
        series.slice().sort(function(a, b) { return (a.key === focus) - (b.key === focus); }).forEach(function(s) {
            var dim = focus !== null && s.key !== focus;
            var group = g.append('g').attr('class', 'viz_series' + (dim ? ' dim' : ''));
            group.append('path').attr('class', 'viz_line' + (s.bold || s.key === focus ? ' bold' : '') + (s.dash ? ' ' + s.dash : ''))
                .style('stroke', s.color).attr('d', path(s.points));
            if (o.dots || s.points.length === 1) {
                group.selectAll(null).data(s.points).enter().append('circle').attr('class', 'viz_dot').style('fill', s.color)
                    .attr('r', 4).attr('cx', function(d) { return x(d[0]); }).attr('cy', function(d) { return y(d[1]); });
            }
            if (s.dot !== false) {
                // Punkt auf dem aktuellen Wert
                var last = s.points[s.points.length - 1];
                group.append('circle').attr('class', 'viz_dot').style('fill', s.color).attr('r', 4).attr('cx', x(last[0])).attr('cy', y(last[1]));
            }
        });

        anchors.forEach(function(a) {
            svg.append('text').attr('class', 'viz_past_label').attr('x', x(a.x)).attr('y', m.top + 10).attr('text-anchor', 'middle').text(a.short || a.label);
            series.forEach(function(s) {
                if (!has(a.values[s.key])) return;
                g.append('circle').attr('class', 'viz_anchor' + (focus !== null && s.key !== focus ? ' dim' : '')).style('stroke', s.color)
                    .attr('r', 4).attr('cx', x(a.x)).attr('cy', y(a.values[s.key]));
            });
        });

        (o.marks || []).forEach(function(mk) {
            svg.append('circle').attr('class', 'viz_target').style('stroke', mk.color).attr('r', 4.5).attr('cx', x(mk.x)).attr('cy', y(mk.y));
            if (mk.text) svg.append('text').attr('class', 'viz_mark_label').attr('x', x(mk.x) + 8).attr('y', y(mk.y) - 7).text(mk.text);
        });

        // Fadenkreuz und Tooltip
        var rule = svg.append('line').attr('class', 'viz_rule').attr('y1', m.top).attr('y2', height - m.bottom).style('display', 'none');
        var hover = svg.append('g');
        var tip = plot.append('div').attr('class', 'viz_tip').style('display', 'none');
        var xs = Array.from(new Set(all.map(function(d) { return d[0]; }))).sort(d3.ascending);
        var hide = function() { rule.style('display', 'none'); tip.style('display', 'none'); hover.selectAll('*').remove(); };
        svg.append('rect').attr('x', m.left).attr('y', 0).attr('width', Math.max(0, width - m.left - m.right)).attr('height', height)
            .attr('fill', 'transparent')
            .on('pointermove pointerdown', function(ev) {
                var raw = +x.invert(d3.pointer(ev)[0]);
                var t = o.snap ? o.snap(raw) : xs[d3.bisectCenter(xs, raw)];
                var slack = o.time ? 20 * 864e5 : 0.05, an = anchorAt[t];
                var rows = series.map(function(s) {
                    var v = an ? (has(an.values[s.key]) ? an.values[s.key] : null) : at(s.points, t, s.range === undefined ? slack : s.range);
                    return v === null ? null : {s: s, v: v};
                }).filter(function(r) { return r; });
                if (!rows.length) return hide();
                if (o.legend === 'values') rows.sort(function(a, b) { return b.v - a.v; });
                var tx = x(t);
                rule.attr('x1', tx).attr('x2', tx).style('display', null);
                hover.selectAll('*').remove();
                rows.forEach(function(r) {
                    hover.append('circle').attr('class', 'viz_dot').style('fill', r.s.color).attr('r', 4).attr('cx', tx).attr('cy', y(r.v));
                });
                tip.selectAll('*').remove();
                tip.style('display', null);
                tip.append('div').attr('class', 'viz_tip_title').text(an ? an.label : o.title ? o.title(t) : xFormat(t));
                rows.forEach(function(r) {
                    var row = tip.append('div').attr('class', 'viz_tip_row');
                    row.append('i').style('color', r.s.color);
                    row.append('span').text(r.s.name);
                    var est = !an && r.s.estTo !== undefined && r.s.estTo !== null && t <= r.s.estTo;
                    row.append('b').text((est ? '≈ ' : '') + value(r.v, r.s));
                });
                var w = tip.node().offsetWidth;
                var left = tx + 12 + w > width ? tx - 12 - w : tx + 12;
                tip.style('left', Math.max(0, left) + 'px');
            })
            .on('pointerleave', hide);
    }

    return {line: line, num: num};
}());
