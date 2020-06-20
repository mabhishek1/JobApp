export const getAllJobs = () =>{
    // return fetch("http://localhost:3001/api/jobs")
    // .then(res=>{
    //     console.log(res.json())
    //     return res.json()
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
    // fetchJobs().then(res=>{
    //     console.log(res)
    // })
}

export async function fetchJobs() {
    const res = await fetch("/api/jobs");
    let json = await res.json();
    // console.log(json)
    return json
}  