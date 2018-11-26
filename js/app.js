$(function () {
    // load_templates()

    var merge_requests_template = Handlebars.compile($('#merge-request-list-template').html());
    Handlebars.registerPartial('merge-request', $('#merge-request-template').html());

    var pipelines_template = Handlebars.compile($('#pipeline-list-template').html());
    Handlebars.registerPartial('pipeline', $('#pipeline-template').html());
    Handlebars.registerPartial('pipeline-job', $('#pipeline-job-template').html());

    Handlebars.registerHelper('duration', function (seconds) {
        return duration(seconds);
    });

    function refresh() {
        projects = get_projects(account_type, account_id)
        projects = enrich_projects_metadata(projects)

        merge_requests = []
        $.each(projects, function (project_index, project) {
            $.each(project.merge_requests, function (merge_request_index, merge_request) {
                merge_requests.push({
                    'id': null_safe_get(merge_request, 'id'),
                    'title': null_safe_get(merge_request, 'title'),
                    'create_date': null_safe_get(merge_request, 'created_at'),
                    'update_date': null_safe_get(merge_request, 'updated_at'),
                    'source_branch': null_safe_get(merge_request, 'source_branch'),
                    'target_branch': null_safe_get(merge_request, 'target_branch'),
                    'notes': null_safe_get(merge_request, 'user_notes_count'),
                    'upvotes': null_safe_get(merge_request, 'upvotes'),
                    'downvotes': null_safe_get(merge_request, 'downvotes'),
                    'project': {
                        'namespace': null_safe_get(project, 'namespace.full_path'),
                        'name': null_safe_get(project, 'path'),
                        'url': null_safe_get(project, 'web_url')
                    },
                    'author': {
                        'username': null_safe_get(merge_request, 'author.username'),
                        'name': null_safe_get(merge_request, 'author.name'),
                        'url': null_safe_get(merge_request, 'author.web_url')
                    },
                    'ci': {
                        'status': null_safe_get(merge_request, 'pipeline.status')
                    }
                });
            });
        });

        pipelines = []
        $.each(projects, function (project_index, project) {
            if (project.pipeline) {
                pipelines.push({
                    'id': null_safe_get(project, 'pipeline.id'),
                    'branch': null_safe_get(project, 'pipeline.ref'),
                    'create_date': null_safe_get(project, 'pipeline.created_at'),
                    'status': null_safe_get(project, 'pipeline.status'),
                    'jobs' : null_safe_get(project, 'pipeline.jobs'),
                    'duration': null_safe_get(project, 'pipeline.duration'),
                    'url': null_safe_get(project, 'pipeline.we_url'),
                    'project': {
                        'namespace': null_safe_get(project, 'namespace.full_path'),
                        'name': null_safe_get(project, 'path'),
                        'url': null_safe_get(project, 'web_url')
                    },
                    'author': {
                        'username': null_safe_get(project, 'pipeline.user.username'),
                        'name': null_safe_get(project, 'pipeline.user.name'),
                        'url': null_safe_get(project, 'pipeline.user.web_url')
                    }
                });                
            }
        });

        var context = {
            'merge_requests': date_sort(merge_requests, 'update_date'),
            'pipelines': date_sort(pipelines, 'create_date')
        }

        console.log(context);

        $('#merge-requests-page section').html(merge_requests_template(context));
        $('#pipelines-page section').html(pipelines_template(context));

        $('time.timeago').timeago();
    }

    refresh();

    setInterval(
        function(){ refresh() }, 
        60 * 1000 * refresh_interval
    );
});