function api_call(path, params={}) {
    // Convert jQuery promise to ES6 promise
    // because since v3, jQuery promises are retarded
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://${host}/api/v4${path}`,
            type: 'get',
            beforeSend: function (request) {
                request.setRequestHeader('Access-Control-Allow-Origin', '*');
                request.setRequestHeader('Private-Token', token);
            },
            data: params,
            dataType: 'json',
            async: true,
            success: (data, textStatus, jqXHR) => {
                resolve(data);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                reject(errorThrown);
            }
        });
    });
}

function get_projects(account_type, account_id) {
    return api_call(`/${account_type}s/${encodeURIComponent(account_id)}/projects`, {'per_page': 100})
        .then((projects) => {
            return enrich_projects_metadata(projects);
        });
}

function enrich_projects_metadata(projects) {
    return Promise
        .all(projects.map(project => enrich_project_metadata(project)));
}

function enrich_project_metadata(project) {
    return Promise
        .all([
            get_merge_requests_in_state(project.id, 'opened'),
            get_latest_pipeline_for_branch(project.id, project.default_branch)
        ])
        .then((result) => {
            let [merge_requests, pipeline] = result;
            project.merge_requests = merge_requests;
            project.pipeline = pipeline;
            return project;
        });
}

function get_merge_requests_in_state(project_id, state) {
    return api_call(`/projects/${project_id}/merge_requests`, {'state': state})
        .then(function(merge_requests){
            return enrich_merge_requests_metadata(merge_requests)
        });
}

function enrich_merge_requests_metadata(merge_requests) {
    return Promise
        .all(merge_requests.map(merge_request => enrich_merge_request_metadata(merge_request)));
}

function enrich_merge_request_metadata(merge_request) { 
    return get_latest_pipeline_for_merge_request(merge_request.project_id, merge_request.iid)
        .then(function(pipeline) {
            merge_request.pipeline = pipeline;
            return merge_request;
        });
}

function get_latest_pipeline_for_branch(project_id, branch) {
    return api_call(`/projects/${project_id}/pipelines`, {'ref': branch})
        .then((pipelines) => {
            return pipelines.length > 0 ? get_pipeline_details(project_id, pipelines[0].id) : undefined;
        });
}

function get_latest_pipeline_for_merge_request(project_id, merge_request_iid) {
    return api_call(`/projects/${project_id}/merge_requests/${merge_request_iid}/pipelines`)
        .then((pipelines) => {
            return pipelines.length > 0 ? pipelines[0] : undefined;
        });
}

function get_pipeline_details(project_id, pipeline_id) {
    return Promise.all([
        api_call(`/projects/${project_id}/pipelines/${pipeline_id}`),
        get_pipeline_jobs(project_id, pipeline_id)
    ])
    .then((result) => {
        let [pipeline_details, pipeline_jobs] = result;
        pipeline_details.jobs = pipeline_jobs || [];
        return pipeline_details;
    });
}

function get_pipeline_jobs(project_id, pipeline_id) {
    return api_call(`/projects/${project_id}/pipelines/${pipeline_id}/jobs`);
}
