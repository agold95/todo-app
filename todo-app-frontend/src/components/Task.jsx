import { useEffect, useState } from "react"

import EditTaskForm from "./EditTaskForm"

// bootstrap components
import { Button, Container } from "react-bootstrap"

const Task = ({ task, updateTask, removeTask, pastDueTasks, setPastDueTasks}) => {
    const [taskFormVisible, setTaskFormVisible] = useState(false)

    const hideWhenVisible = { display: taskFormVisible ? 'none' : '' }
    const showWhenVisible = { display: taskFormVisible ? '' : 'none' }

    // evaluates deadline and current time to determine if task is past due or not, then renders it
    useEffect(() => {
        const isTaskPastDue = new Date(task.deadline) < Date.now()
        const isTaskAlreadyAdded = pastDueTasks.some(pastDueTask => pastDueTask.id === task.id)

        if (task.deadline === null) {
            return 
        } else if (isTaskPastDue && !isTaskAlreadyAdded) {
            setPastDueTasks(prevPastDueTasks => [...prevPastDueTasks, task])
        } else if (!isTaskPastDue && isTaskAlreadyAdded) {
            setPastDueTasks(prevPastDueTasks => prevPastDueTasks.filter(pastDueTask => pastDueTask.id !== task.id))
        }
    }, [task, pastDueTasks, setPastDueTasks])

    const pastDueTasksHandler = () => {
        if (task.deadline === null) {
            return null
        } else if (new Date(task.deadline) < Date.now()) {
            return <h5 className="text-danger alert alert-danger"><i>This task is past due!</i></h5>
        } else {
            return null
        }
    }

    return (
        <Container className="py-3 mb-3 border border-secondary rounded d-flex justify-content-between align-items-center">
            <div style={hideWhenVisible}>
                <h3>{task.content}</h3>
                {task.deadline === null
                    ? <p>Due on: none specified</p>
                    : <p>Due on: {new Date(task.deadline).toLocaleDateString()} by {new Date(task.deadline).toLocaleTimeString()}</p>}
                {pastDueTasksHandler()}
                <small><i>Added on: {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString()}</i></small>
            </div>
            <div style={showWhenVisible}>
                <EditTaskForm task={task} updateTask={updateTask} setTaskFormVisible={setTaskFormVisible} />
            </div>
            <div className="d-flex flex-column">
                <div style={hideWhenVisible}>
                    <Button className="m-1" variant="outline-primary" onClick={() => setTaskFormVisible(true)}>Edit Task</Button>
                </div>
                <div>
                    <Button className="m-1" variant="outline-danger" onClick={() => removeTask(task)}>Finish Task</Button>
                </div>
            </div>
        </Container>
    )
}

export default Task