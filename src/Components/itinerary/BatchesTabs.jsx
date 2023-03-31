import React, {Component} from "react";
import {Checkbox, Col, Row, Steps, DatePicker} from "antd";
import {get, groupBy, map} from 'lodash'
import moment from "moment";
import {isMobile} from "react-device-detect";
// import {Checkbox, Col, Row, Steps} from "antd";

const {Step} = Steps;

class BatchesTabs extends Component {
    state = {
        monthGroup: {},
        selectedMonth: 0,
        dates: [],
        // selectedBatch: '',
        customDate : null
    }
    datePickerRef = React.createRef();
    componentDidMount() {
        const batches = get(this.props, 'trip.batches', []).map(batch => {
            return {
                to: moment(batch.to).format('DD MMM YYYY'),
                from: moment(batch.from).format('DD MMM YYYY'),
                month: moment(batch.to).format('MMMM')
            }
        });
        const monthGroup = groupBy(batches, 'month')
        this.setState({
            monthGroup,
            selectedMonth: 0,
            dates: monthGroup[Object.keys(monthGroup)[0]],
            // selectedBatch: `${(monthGroup[Object. keys(monthGroup)[0]])[0].to} - ${(monthGroup[Object. keys(monthGroup)[0]])[0].from}`
        })
        this.props.updateSelectedBatch(`${(monthGroup[Object.keys(monthGroup)[0]])[0].to} - ${(monthGroup[Object.keys(monthGroup)[0]])[0].from}`)
    }

    stepChange = (current) => {
        this.setState({
            selectedMonth: current,
            dates: this.state.monthGroup[Object.keys(this.state.monthGroup)[current]]
        })
    }

    onDateChange=(date)=>{
        if(!date){
            this.setState({
                customDate: date
            }, ()=>this.props.updateSelectedBatch(null))
            
            return;
        }
        const fromDate = moment(date).add(this.props.trip.noOfDays, 'days')
        console.log(fromDate, 'ddd')
        const batch = `${moment(date).format('DD MMM YYYY')} - ${moment(fromDate).format('DD MMM YYYY')}`
        this.setState({
            customDate: moment(date)
        }, () => this.props.updateSelectedBatch(batch))
        

    }

    render() {
        return (
            <div className="row mx-0 tabs-main-row">
                <div className={"col-12"}>
                    <div className="row tabs-card-data">
                        <div className="col-12 col-sm-2">
                            {!isMobile && <Steps progressDot current={this.state.selectedMonth}
                                                onChange={(current) => this.stepChange(current)} direction="vertical">
                                {map(Object.keys(this.state.monthGroup), month => {
                                    return (<Step key={month} title={month}/>)
                                })}
                            </Steps>}
                        </div>
                        <div className="col-12 col-sm-10">
                            <div className="row itinerary-details-row">
                                <div className="col-12">
                                    <h6>Travelling On</h6>
                                    <DatePicker value={this.state.customDate} onChange={this.onDateChange} className="custom-batch" format={"dddd, DD MMM YYYY"} disabledDate={(current) => current && current < moment().endOf('day')}/>
                                    <h6>Select from existing batches</h6>
                                    <Checkbox.Group style={{width: '100%'}}  value={[this.props.selectedBatch]}>
                                        <Row>
                                            {map(this.state.dates, date => {
                                                return (
                                                    <Col span={24}>
                                                        <Checkbox
                                                            onChange={() => {
                                                                this.setState({
                                                                    customDate: null
                                                                }, ()=>  this.props.updateSelectedBatch(`${date.to} - ${date.from}`))
                                                               
                                                            }}
                                                            key={`${date.to} - ${date.from}`}
                                                            value={`${date.to} - ${date.from}`}>{`${date.to} - ${date.from}`}</Checkbox>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BatchesTabs;