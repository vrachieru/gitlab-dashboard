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
