const months: { [key: string]: string } = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  };
  
  const convertDate = (date: string): string => {
    let dateParts
      if (date.includes("-")) {
          dateParts = date.split("-");
          
      } else { 
          dateParts =date.split("/")
      }
    return `${months[dateParts[1]]} ${dateParts[2]}, ${dateParts[0]}`;  // Returns in format "Month DD, YYYY"
  };
  
export {convertDate}