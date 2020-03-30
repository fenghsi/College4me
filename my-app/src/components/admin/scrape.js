import React from 'react';
import axios from 'axios';
import { notification } from 'antd';
function Scrape(props) {

    
    async function handleDeleteStduents(event){
        event.preventDefault();
        notification.open({
            message: "delete_all_student_profiles",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/delete_all_student_profiles', {
           
        });
       
    }
    async function handleImportScorecard(event){
        event.preventDefault();
        notification.open({
            message: "import_college_scorecard",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/import_college_scorecard', {
           
        });
        
    }
    async function handleImportCollegeRankings(event){
        event.preventDefault();
        notification.open({
            message: "scrape_college_ranking",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/scrape_college_ranking', {
           
        });
       
    }
    async function handleImportCollegestxt(event){
        event.preventDefault();
        notification.open({
            message: "import_Colleges",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/import_Colleges', {
           
        });

    }
    async function handleImportStudentsdataset(event){
        event.preventDefault();
        notification.open({
            message: "import_student_profile_dataset_Student",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/import_student_profile_dataset_Student', {
           
        });
        
    }
    async function handleImportApplications(event){
        event.preventDefault();
        notification.open({
            message: "import_student_profile_dataset_Application",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/import_student_profile_dataset_Application', {
           
        });
    }
    async function handleCollegeDataCom(event){
        event.preventDefault();
        notification.open({
            message: "scrape_college_data",
            duration:2.5 
        });
        const scrapedata1 = await axios.post('/scrape_college_data', {
           
        });
        
    }
    
    return (
        <div>
            Colege.txt
            <form onSubmit={handleImportCollegestxt}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Import colleges in college.txt</button>
            </form>
            <br></br>
            7.1
            <form onSubmit={handleImportCollegeRankings}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Import College Ranking from WSJ/THE</button>
            </form>
            <br></br>
            7.2
            <form onSubmit={handleImportScorecard}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Import college Scorecard datas</button>
            </form>
            <br></br>
            7.3
            <form onSubmit={handleCollegeDataCom}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Scrape collegedata.com</button>
            </form>
            <br></br>
            7.4
            <form onSubmit={handleDeleteStduents}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Delete all Students Account</button>
            </form>
            <br></br>
            7.5.1
            <form onSubmit={handleImportStudentsdataset}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Import Student profiles</button>
            </form>
            <br></br>
            7.5.2
            <form onSubmit={handleImportApplications}>
                    <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Import Applications</button>
            </form>
            <br></br>
           
        
        </div>
    );
}

export default Scrape;