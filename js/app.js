$(function () {
    // load_templates()

    var merge_requests_template = Handlebars.compile($("#merge-request-list-template").html());
    Handlebars.registerPartial("merge-request", $("#merge-request-template").html());

    var pipelines_template = Handlebars.compile($("#pipeline-list-template").html());
    Handlebars.registerPartial("pipeline", $("#pipeline-template").html());
    Handlebars.registerPartial("pipeline-job", $("#pipeline-job-template").html());

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

    $("#merge-requests-page section").append(merge_requests_template(context));
    $("#pipelines-page section").append(pipelines_template(context));

    console.log(context);
});