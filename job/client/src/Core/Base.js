import React from 'react'

const Base = ({children}) =>(
 
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="">DailyJobApply.com</a>
        
      </nav>
      <div>{children}</div>
    </div>
  
)

export default Base
