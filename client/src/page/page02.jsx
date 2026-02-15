import { useState } from 'react'
import { Link } from 'react-router-dom';


function Page02() {


  return (
    <>
      <h1>Page 02</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">App</Link>
          </li>
          <li>
            <Link to="/page01">Page 01</Link>
          </li>
          <li>
            <Link to="/page02">Page 02</Link>
          </li>
          <li>
            <Link to="/page03">Page 03</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Page02
