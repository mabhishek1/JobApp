import React, { useState, useEffect } from 'react'
import Base from './Base'
import {CircularProgress} from "@material-ui/core"
import { getAllJobs, fetchJobs} from '../ApiCalls'
import Job from './Job'
import JobModal from './JobModal'
import {Jumbotron,Button,InputGroup,FormControl,SplitButton,Dropdown,DropdownButton} from "react-bootstrap"
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import "./../App.css"
export default function Jobs() {

    const [jobsList, setjobsList] = useState({
        loading:true,
        jobsMain:[],
        jobs:[],
        success:true,
        error:false
    })
    
    const [filterData, setfilterData] = useState({
        byLocation:[],
        byJobType:[],
        jobTypeTitle:"JobType",
        locationTitle:"Location"
    })
    
    const [input, setinput] = useState({
        inputVal:""
    })
    const {inputVal} = input
    const {loading,jobs,success,error,jobsMain} = jobsList
    const {byJobType,byLocation,jobTypeTitle,locationTitle} = filterData


    const handleChange = name => event=>{
        setinput({inputVal:event.target.value})
        filterJobsByKeyWord(inputVal)
    }

    const filterJobsByKeyWord = (keyWord) =>{
        let newJobs = []
        if(jobs){
            newJobs = jobsMain.filter(job =>{
                let matchStr = job.company+job.location+job.title 
                matchStr = matchStr.toLowerCase()
                keyWord = keyWord.toLowerCase()
                if( matchStr.includes(keyWord)){
                    return job
                }
            })

        }
        setjobsList({...jobsList,jobs:newJobs})
    }
    

    const filterJobsByJobTypeAndLocation = ({location="all",type="all"})=>{
        setActiveStep(0)
        setfilterData({...filterData,jobTypeTitle:type,locationTitle:location})
        let keyWordType = type.toLowerCase()
        let keyWordLocation = location.toLowerCase()
        let newJobs = []
        if(keyWordType !== "jobtype" && keyWordLocation !== "location"){
            newJobs = jobsMain.filter(job=>{
                if(job.type.toLowerCase() === keyWordType && job.location.toLowerCase() === keyWordLocation){
                    return job
                }
            })
        }else if(keyWordType !== "jobtype"){
            newJobs = jobsMain.filter(job=>{
                if(job.type.toLowerCase() === keyWordType){
                    return job
                }
            })
        }else if(keyWordLocation !== "location"){
            newJobs = jobsMain.filter(job=>{
                if(job.location.toLowerCase() === keyWordLocation){
                    return job
                }
            })
        }
        
        setjobsList({...jobsList,jobs:newJobs})
    }

    // const filterJobsByJobType = (type)=>{
    //     setfilterData({...filterData,jobTypeTitle:type})
    //     let keyWord = type.toLowerCase()
    //     let newJobs = []
    //     newJobs = jobs.filter(job=>{
    //         if(job.type.toLowerCase() === keyWord){
    //             return job
    //         }
    //     })
    //     setjobsList({...jobsList,jobs:newJobs})
    // }
    
    // const filterJobsByJobLocation = (location)=>{
    //     setfilterData({...filterData,locationTitle:location})
    //     let keyWord = location.toLowerCase()
    //     let newJobs = []
    //     newJobs = jobs.filter(job=>{
    //         if(job.location.toLowerCase() == keyWord){
    //             return job
    //         }
    //     })
    //     setjobsList({...jobsList,jobs:newJobs})
    // }

    // const showAllJobs = () =>{
    //     setfilterData({...filterData,jobTypeTitle:"JobType",locationTitle:"Location"})
    //     setjobsList({...jobsList,jobs:jobsMain})
    // }

    const filterByLocation = (res) =>{
        let locations = []
        let uniq = []
        if(res){
            res.forEach(job=>{
                locations.push(job.location)
            })
        }
        
        uniq = [...new Set(locations)];
        return uniq
    }
    
    const filterByJobType = (res) =>{
        let type = []
        let uniq = []
        res.forEach(job=>{
            type.push(job.type)
        })
        uniq = [...new Set(type)];
        return uniq
    }

    const filterAlgo = (res)=>{
        const uniqJob = filterByJobType(res)
        const uniqLoc = filterByLocation(res)
        setfilterData({...filterData,byJobType:uniqJob,byLocation:uniqLoc})
    }

    useEffect(() => {
        fetchJobs()
        .then(res=>{
            setjobsList({...jobsList,jobs:res,jobsMain:res,loading:false,success:true,error:false})
            filterAlgo(res)

        })
        .catch((err)=>{
            setjobsList({...jobsList,error:true,success:false,loading:false})
        })
        
    }, [loading])

    const displayLocation = () =>{
        return byLocation.map((location,i)=>(
            <Dropdown.Item onClick={()=>filterJobsByJobTypeAndLocation({location:location,type:jobTypeTitle})} style={{width:"contain"}} key={i}>{location}</Dropdown.Item>
        ))
    }

    const displayJobType = () =>{
        return byJobType.map((jobtype,i)=>(
            <Dropdown.Item onClick={()=>filterJobsByJobTypeAndLocation({location:locationTitle,type:jobtype})} key={i}>{jobtype}</Dropdown.Item>
        ))
    }


    const filterSection = () =>{
        return(
            <div>
                <br/>
                <Jumbotron style={{width:"80%",margin:"auto"}}>
                    
                <div>

                    <InputGroup className="mb-3">
                        <FormControl 
                        onChange={handleChange("password")}
                        style={{width:"50px"}}
                        placeholder="Filter by keyword"
                        aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                        <Button variant="success">Filter</Button>
                        </InputGroup.Append>
                    </InputGroup>

                                    
                                <SplitButton
                                id={`dropdown-split-variants-success`}
                                title={jobTypeTitle}
                                >
                                    <Dropdown.Item onClick={()=>filterJobsByJobTypeAndLocation({location:locationTitle,type:"JobType"})} key={"def"}>Show All JobType</Dropdown.Item>
                                    {displayJobType()}
                                </SplitButton>{' '}
                                <SplitButton
                                id={`dropdown-split-variants-success`}
                                title={locationTitle}
                                >
                                    <Dropdown.Item onClick={()=>filterJobsByJobTypeAndLocation({location:"Location",type:jobTypeTitle})} key={"def"}>Show All Locations</Dropdown.Item>
                                    {displayLocation()}
                                </SplitButton>
                    
                    </div>
                    
                </Jumbotron>   
            </div>
        )
    }

    const isLoading = () =>{
        if(loading){
            return (
                    <center>
                        <br/>
                        <br/>
                        <br/><br/><br/><br/>
                        <CircularProgress color="inherit"/>
                    </center>
            );
        }
    }


    // modal
    const [open, setOpen] = React.useState(false);
    const [selectedJob, selectJob] = React.useState({});
    function handleClickOpen() {
      setOpen(true);
    }  
    function handleClose() {
      setOpen(false);
    }
    // pagination
    const numJobs = jobs.length;
    let limit = 20
    const numPages = Math.ceil(numJobs / limit);
    const [activeStep, setActiveStep] = React.useState(0);
    const jobsOnPage = jobs.slice(activeStep * limit, (activeStep * limit) + limit);

    function scrollToTop () {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, c - c / 8);
        }
      };

    function handleNext() {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        scrollToTop();
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
        scrollToTop();
    }    

    return (
        <Base>
            {isLoading}
            {filterSection()}
            <div className="jobs">
                <JobModal open={open} job={selectedJob} handleClose={handleClose} />
                
                <div className="container">
                    <h3><i>Found {jobs.length} Jobs</i></h3>
                    <i style={{color:"#89C4F4"}}>Showing results for {jobTypeTitle} and {locationTitle}</i>
                </div>     
                
                {
                    jobsOnPage.map(
                        (job, i) => <Job key={i} job={job} onClick={() => {
                            console.log('clicked')
                            handleClickOpen();
                            selectJob(job)
                        }} />
                    )
                }
                <div><br/>
                    <p>Page {activeStep + 1} of {numPages}</p>
                </div>
                <MobileStepper
                    variant="progress"
                    steps={numPages}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === numPages - 1}>
                        Next
                        <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />
                        Back
                        </Button>
                    }
                />

            </div>
        </Base>
    )
}




// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));
  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );
  