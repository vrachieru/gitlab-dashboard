function api_call(path, params) {
    var result = null;
    $.ajax({
        url: `https://${host}/api/v4${path}`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader('Private-Token', token);
        },
        data: params,
        dataType: 'json',
        async: false,
        success: function (data) {
            result = data;
        }
    });

    return result;
}

function get_projects(account_type, account_id) {
    return api_call(
        `/${account_type}s/${account_id}/projects`,
        {'per_page': 100}
    );
}

function enrich_projects_metadata(projects) {
    $.each(projects, function (index, project) {
        project.pipeline = get_latest_pipeline(project.id, project.default_branch);
    });

    return projects;
}

function get_latest_pipeline(project_id, branch) {
    var result = api_call(
        `/projects/${project_id}/pipelines`,
        {'ref': branch}
    );

    return result.length > 0 ? get_pipeline_details(project_id, result[0].id) : null;
}

function get_pipeline_details(project_id, pipeline_id) {
    pipeline_details = api_call(`/projects/${project_id}/pipelines/${pipeline_id}`, {});
    pipeline_details.jobs = get_pipeline_jobs(project_id, pipeline_id);
    
    return pipeline_details;
}

function get_pipeline_jobs(project_id, pipeline_id) {
    return api_call(`/projects/${project_id}/pipelines/${pipeline_id}/jobs`, {});
}
