import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";




function Home(props) {
    let history = useHistory();
    const [testmsg, settestmsg] = useState("none");
    const location = useLocation();
    

   
    async function handletest(event){
        event.preventDefault();
        console.log("Hello");
        const res = await axios.post('/test', {
            id:1
        });
        settestmsg(res.data.msg);
        history.push('/test' );
    }




    return (
            <div id = "homepage">
                <p>hello</p>
                <form onSubmit={handletest}>
                        <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Add Item???</button>
                </form>
            <p>Msg:{testmsg}</p>
            </div>
     );
}

export default Home; 