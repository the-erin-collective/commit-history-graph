let cachedResponses: Array<any> = [];

const getCachedResponse = async (identifier: string) => {
  let responseContents = null;

  cachedResponses.forEach((response) => {
    if(response.identifier == identifier)
    {
      responseContents = response.responseContents;
    }
  });

  return responseContents;
}

const saveCachedResponse = async (identifier: string, responseContents: string) => {
  let update = false;

  if(responseContents == null || responseContents.length == 0)
  {
    return;
  }
  
  cachedResponses.forEach((response) => {
    if(response.identifier == identifier)
    {
      response.fileContents = responseContents;
      update = true;
    }
  });

  if(!update){
    cachedResponses.push({
      identifier: identifier,
      responseContents: responseContents 
    });
  }

  return;
}

export default {
  GetResponse : getCachedResponse,
  SaveResponse : saveCachedResponse
}