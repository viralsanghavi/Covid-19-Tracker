import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

import './InfoBox.css'

function InfoBox({ title, cases, total, active, isRed, ...props }) {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}
            onClick={props.onClick}
        >
            <CardContent>
                {/* Corono cases */}
                {/*  {title} */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* +120k no of cases */}
                <h2 className="infoBox__cases">{cases}</h2>
                {/*  1.2M Total Cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
