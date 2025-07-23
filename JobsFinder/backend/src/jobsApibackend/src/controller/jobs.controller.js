import { fetchJobsFromAdzuna } from "../lib/adzuna.js"


export const getJobs = async (req, res) => {
    try{
        const {country, page, query } = req.query;
        const jobs = await  fetchJobsFromAdzuna();
        res.send(jobs);
    }catch(err){
        console.log(`error in fetching data: ${err}`)
        res.send(400).json({
            message: err.message
        })
    }
}