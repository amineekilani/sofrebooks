document.getElementById("year").innerHTML=new Date().getFullYear();
function Time()
{
    const now=new Date();
    const optionsDate={year: "numeric", month: "2-digit", day: "2-digit"};
    const optionsTime={hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true};
    const formattedDate=now.toLocaleDateString("en-GB",optionsDate);
    const formattedTime=now.toLocaleTimeString("en-GB",optionsTime);
    document.getElementById("time").innerHTML=formattedDate+"<br>"+formattedTime;
}
setInterval(Time,1000);
Time();