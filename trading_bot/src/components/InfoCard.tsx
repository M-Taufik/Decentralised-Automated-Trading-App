import type {NextPage} from 'next';
import { Card, Text, Row, Col, Button} from "@nextui-org/react";

interface Props {
    title: string;
    label: string;
    imageURL: string;
    Balance: string;
}

const InfoCard: NextPage<Props> = (props) => {

    const { title, label, imageURL, Balance } = props;

    return (
        <Card>
            <Card.Header css={{position: "absolute", top: 5}}>
                <Col>
                    <Text size={12} weight="bold" transform="uppercase" color="grey">
                        {label} 
                    </Text>
                    <Text h2 color="grey">
                        {title}
                    </Text>
                </Col>
            </Card.Header>
            <Card.Image src={imageURL}></Card.Image>
            <Card.Footer
                isBlurred
                css={{
                    position: "absolute",
                    bgBlur: "#0f111466",
                    bottom: 0
                }}
            >
                <Row>
                    <Col>
                        <Text color="#d1d1d1" size={18}>
                            {Balance} Ethereum
                        </Text>
                    </Col>
                    <Col>
                        <Row justify="flex-end">
                     { /*      <Button flat auto rounded color="primary">
                                <Text
                                    css={{color: "inherit"}}
                                    size={12}
                                    weight="bold"
                                    transform="uppercase"
                                >
                                    Enroll In Course
                                </Text>
                            </Button> 
            */}
                        </Row>
                    </Col>
                </Row>

            </Card.Footer>
        </Card>
    )
}

export default InfoCard;