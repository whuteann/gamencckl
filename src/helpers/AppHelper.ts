

export const convertToEmailAppropriate = (text: string) => {
  const transformedText = text.toLowerCase().replace(/\s/g, '');

  return transformedText;
}

export const convertFirebaseDate = (firebasedate: any) =>{
  let newDateObj = new Date();
  
  if(firebasedate.seconds){
    newDateObj = new Date(firebasedate.seconds * 1000) 
  }else{
    newDateObj = new Date(firebasedate);
  }
 

  return `${newDateObj.toDateString()}, ${newDateObj.getHours() < 10 ? `0${newDateObj.getHours()}`: newDateObj.getHours()}:${newDateObj.getMinutes() < 10 ? `0${newDateObj.getMinutes()}`: newDateObj.getMinutes()}`
}


export const convertFirebaseDateObj = (firebasedate: any): Date =>{
  let newDateObj = new Date();
  
  if(firebasedate.seconds){
    newDateObj = new Date(firebasedate.seconds * 1000) 
  }else{
    newDateObj = new Date(firebasedate);
  }
 

  return newDateObj
}