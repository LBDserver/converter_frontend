import React from 'react'
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"


function ApiComponent() {
    return (
        <div>
            <SwaggerUI url={process.env.PUBLIC_URL + '/swagger.json'} />
        </div>
    )
}

export default ApiComponent