
type TestProps = {
    name: string
}
const Test: React.FC<TestProps> = ({name}) => {
    return <div className="w-screen p-4 bg-green-500">{name}</div>
}

export default Test