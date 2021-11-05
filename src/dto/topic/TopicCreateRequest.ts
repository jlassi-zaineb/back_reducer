export interface TopicCreateRequest {
    title: string;
    description: string;
    technos:string;
    topic_databases: string,
    screenshots: string;
}

export const getSQLCreateValues = (req: TopicCreateRequest) => {
  

    var technosJson = JSON.stringify(req.technos);
    var dbJson = JSON.stringify(req.topic_databases);
    var screenshotJson = JSON.stringify(req.screenshots);


    var sqlValues: string = `"${ req.title }", "${ req.description }" , '${ technosJson }',  '${ dbJson }','${  screenshotJson}'`

    return sqlValues;
}



