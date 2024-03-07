export const errorHandler = (statusCode,message)=>{
    const error = new Error();  //error js constructor
    error.statusCode=statusCode;
    error.message=message;
    return error;
};