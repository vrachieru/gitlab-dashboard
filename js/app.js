$(function () {
    var template = Handlebars.compile($("#app-template").html());
    Handlebars.registerPartial("project", $("#project-template").html());
    Handlebars.registerPartial("pipeline", $("#pipeline-template").html());
    Handlebars.registerPartial("job", $("#job-partial").html());

    Handlebars.registerHelper('duration', function (seconds) {
        return duration(seconds);
    });

    Handlebars.registerHelper('ago', function (date) {
        return ago(date);
    });

    projects = get_projects(account_type, account_id)
    projects = enrich_projects_metadata(projects)

    var context = {
        'projects': projects
    };

    $("#pipelines-page section").append(template(context));

    console.log(context);
});