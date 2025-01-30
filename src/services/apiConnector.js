import axios from "axios";

export const axiosInstance = axios.create({});
export const apiConnector = (method,url,body,headers,params)=>{
    console.log(body);
    
return axiosInstance({
    method: `${method}`,
    url:`${url}`,
    headers: headers ? headers : null,
    data: body ? body : null,
    params : params ? params : null,
})
}