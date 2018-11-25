function load_templates() {
    $('script[type="text/x-handlebars-template"]').each(function (index, template) {
        $.ajax({
            url: $(template).attr('src'),
            // type: 'get',
            dataType: 'html',
            async: false,
            success: function (data) {
                $(template).html(data);
            }
        });
    });
}

function get_url_param(name, dfault) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);

    return results === null ? dfault : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function duration(seconds) {
    var duration = seconds;
    var hours = ~~(duration / 3600);
    var minutes = ~~((duration % 3600) / 60);
    var seconds = Math.trunc(duration % 60);

    var timeString = '';

    if (hours > 0) {
        timeString += `${hours}:${minutes < 10 ? '0' : ''}`;
    }

    timeString += `${minutes}:${seconds < 10 ? '0' : ''}`;
    timeString += `${seconds}`;

    return timeString;
}

function ago(time) {
    var timespans = {
        1000: {
            singular: 'a few moments',
            plural: 'a few moments'
        },
        60000: {
            singular: 'about a minute',
            plural: '# minutes'
        },
        3600000: {
            singular: 'about an hour',
            plural: '# hours'
        },
        86400000: {
            singular: 'a day',
            plural: '# days'
        },
        604800000: {
            singular: 'a week',
            plural: '# weeks'
        },
        2592000000: {
            singular: 'a month',
            plural: '# months'
        },
        31540000000: {
            singular: 'a year',
            plural: '# years'
        }
    };

    var parsed_time = Date.parse(time);
    if (parsed_time && Date.now) {
        var time_ago = parsed_time - Date.now();
        var diff = Math.abs(time_ago);

        var timespan;
        Object.keys(timespans).forEach(function(timespan_ms) {
            if (diff > timespan_ms) {
                timespan = timespan_ms;
            }
        });

        var n = Math.round(diff / timespan);

        return timespans[timespan][n > 1 ? 'plural' : 'singular'].replace('#', n) + ' ago';
    }
}
