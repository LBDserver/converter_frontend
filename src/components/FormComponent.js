import React, { Component } from 'react'
import {
    Form,
    Row,
    Col,
    Button,
    Alert
} from 'react-bootstrap'

const axios = require('axios')

export default class FormComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conversions: {
                LBD: { checked: false, fields: { baseUri: '', fileName: '' } },
                ifcOWL: { checked: false },
                GLTF: { checked: false },
                DAE: { checked: false }
            },
            checked: [],
            converted: false,
            conversionUrls: [],
            error: false,
            baseUri: "http://www.example.com/lbdconversion/"
        }
    }

    addToConversionList = (e) => {
        let { conversions, checked } = this.state
        conversions[e.target.id]["checked"] = !conversions[e.target.id]["checked"]
        if (conversions[e.target.id]["checked"]) {
            checked.push(e.target.id)
        } else {
            checked = checked.filter((v, i, a) => {
                return v !== e.target.id
            })
        }

        this.setState({ conversions, checked })
    }

    setFile = (e) => {
        e.preventDefault()
        this.setState({ files: e.target.files[0] })
    }

    setExtension = (c) => {
        switch (c) {
            case ("LBD"):
            case ("ifcOWL"):
                return ('.ttl');
            case ("GLTF"):
                return ('.gltf');
            case ("DAE"):
                return ('.dae');
            case ("XML"):
                return ('.xml');
            default:
                break;
        }
    }

    submitForm = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("ifcFile", this.state.files, this.state.files.name)
        formData.append("conversions", JSON.stringify(this.state.checked))
        if (this.state.checked.includes('LBD')) {
            formData.append("baseUri", this.state.baseUri)
        }

        this.setState({ processing: true })
        axios.post(`http://localhost:4800/convert`, formData, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((res) => {
                const disposition = res.request.getResponseHeader('Content-Disposition')
                var fileName = "";
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
                let blob = new Blob([res.data], { type: 'application/zip' })

                const conversionUrl = URL.createObjectURL(blob)
                let conversionUrls = this.state.conversionUrls
                conversionUrls.push(conversionUrl)
                this.setState({ converted: true, conversionUrls, processing: false })
            })
            .catch((error) => {
                this.setState({ error: error.message, processing: false })
            })
        // }

    }

    onChangeBaseUri = (e) => {
        let baseUri = e.target.value
        if (baseUri.slice(-1) !== '/') {
            baseUri = baseUri + '/'
        }
        this.setState({ baseUri })
    }



    render() {

        let downloadButton, error, baseUri

        downloadButton = this.state.conversionUrls.map(url => {
            return <Alert variant="success" onClose={() => this.setState({ conversionUrls: this.state.conversionUrls.filter((v) => v !== url) })} dismissible>
                Your ZIP file is now ready! Click <Alert.Link href={url}>here</Alert.Link> to download
        </Alert>
        })

        if (this.state.error) {
            error = <Alert variant="danger" onClose={() => this.setState({ error: false })} dismissible>
                <Alert.Heading>Oh snap! A conversion error occured!</Alert.Heading>
                <p>
                    {this.state.error}
                </p>
            </Alert>
        }

        if (this.state.checked.includes('LBD')) {
            baseUri = <Form.Group as={Row} controlId="formBaseUri">
                <Form.Label column sm="2">Base URI</Form.Label>
                <Col sm="10">
                    <Form.Control type="text" name="text" placeholder="http://www.example.com/lbdconversion/" onChange={this.onChangeBaseUri} />
                </Col>
            </Form.Group>
        }

        return (
            <div>
                <Form onSubmit={this.submitForm}>
                    <Form.Group as={Row} controlId="formFile">
                        <Form.Label column sm="2">IFC File</Form.Label>
                        <br />
                        <Col sm="10">
                            <input
                                type="file"
                                name="file"
                                accept=".ifc"
                                onChange={this.setFile}
                                style={{ marginTop: 2 }}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="conversions">
                        <Form.Label column sm="2">Conversions</Form.Label>
                        <br />
                        <Col sm="10">
                            {Object.keys(this.state.conversions).map((type) => (
                                <Form.Check
                                    onChange={this.addToConversionList}
                                    checked={this.state.conversions[type]["checked"]}
                                    inline
                                    key={type}
                                    label={type}
                                    type="checkbox"
                                    id={type}

                                    style={{ marginTop: 7 }}
                                />
                            ))}
                        </Col>
                    </Form.Group>
                    {baseUri}
                    <hr />
                    <Button variant="dark" type="submit" disabled={this.state.files && this.state.checked.length && !this.state.processing > 0 ? false : true}>
                        {this.state.processing ? "Processing" : "Start Conversion"}
                    </Button>
                    <div style={{ marginTop: "20px" }}>
                        {downloadButton}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        {error}
                    </div>
                </Form>
            </div>
        )
    }
}
