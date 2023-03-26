let cachedResponses: Array<any> = [];

const getCachedResponse = async (route: string) => {
  let responseContents = null;

  cachedResponses.forEach((response) => {
    if(response.route == route){
      responseContents = response.responseContents;
    }
  });

  return responseContents;
}

const saveCachedResponse = async (route: string, responseContents: string) => {
  let update = false;
  
  cachedResponses.forEach((response) => {
    if(response.route == route){
      response.fileContents = responseContents;
      update = true;
    }
  });

  if(!update){
    cachedResponses.push({
      route: route,
      responseContents: responseContents 
    });
  }

  return;
}

export default {
  GetResponse : getCachedResponse,
  SaveResponse : saveCachedResponse
}