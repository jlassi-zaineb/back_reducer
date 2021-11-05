import moment from 'moment';

export interface TopicUpdateRequest {
    topic_id : number;
    title: string;
    description: string;
    technos : string;
    screenshots : string,
    topic_databases: string;
    created : Date;

}


export const getSQLUpdateValues = (req: TopicUpdateRequest) => {

    var technosJson = JSON.stringify(req.technos);
    var dbJson = JSON.stringify(req.topic_databases);
    var screenshotJson = JSON.stringify(req.screenshots);

    var sqlValues: string[] = [];

    if(req.title) {
        sqlValues.push(`title = "${ req.title }"`);
    }

    if(req.description) {
        sqlValues.push(`description = "${ req.description }"`);
    }
    if(technosJson) {
        sqlValues.push(`technos = '${ technosJson }'`);
    }
    if(dbJson) {
        sqlValues.push(`topic_databases = '${ dbJson}'`);
    }
    if(screenshotJson) {
        sqlValues.push(`screenshots = '${ screenshotJson }'`);
    }

    if(req.created && moment(req.created, "YYYY-MM-DD", true).isValid()) {
        sqlValues.push(`created = "${ req.created }"`);
    }

    return sqlValues.join(', ');
}
