<p align="center">
    <img src="https://user-images.githubusercontent.com/5860071/48982215-1dedc200-f0e8-11e8-911b-e8788590ba3c.png" width="200px" />
    <br/>
    <a href="https://github.com/vrachieru/gitlab-dashboard/releases/latest">
        <img src="https://img.shields.io/badge/version-0.0.1-brightgreen.svg?style=flat-square" alt="Version">
    </a>
    <br/>
    Zero-knowledge monitoring dashboard for GitLab CI
</p>

This project aims to provide an easy and reliable way of agregating and viewing merge-requests and pipelines from multiple projects in a single place.  
Everything runs in your browser so no private information is leaked outside the dashboard.

## Example

<img src="https://user-images.githubusercontent.com/5860071/48983791-07516600-f0fc-11e8-95b3-869d620c9b44.gif" />

## Usage

The dashboard is available via github pages [here](https://vrachieru.github.io/gitlab-dashboard/).  
Or, you can clone this repository and host your own.

#### Menu logo characteristics

The GitLab icon on the navigation menu displays the state of the dashboard.

| Characteristic   | Dashboard state             |
| ---------------- | --------------------------- |
| white            | previous refresh successful |
| red              | previous refresh failed     |
| pulsating        | refresh in progress         |

#### Card color codes

The background color for the cards represents the state of the CI for the respective item.

| Color | CI state  |
| ----- | --------- |
| green | passed    |
| red   | failed    |
| black | cancelled |
| gray  | skipped   |

## Configuration

Configuration is done via query params.  

| Parameter        | Default value | Description                                                                           |
|------------------|---------------|---------------------------------------------------------------------------------------|
| host             | gitlab.com    | Gitlab instance host.                                                                 |
| token            | -             | Gitlab API private token.                                                             |
| account_type     | user          | Type of account in which to look for projects. Possible values are `user` and `group`.|
| account_id       | -             | Id of account in which to look for projects.                                          |
| refresh_interval | 10            | Interval, in minutes, in which to poll for new data.                                  |

## License

MIT