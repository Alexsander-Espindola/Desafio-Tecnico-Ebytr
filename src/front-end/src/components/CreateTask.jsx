import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/createTask.css';
import { useDispatch } from 'react-redux';
import { createTask } from '../api/api';
import { Warning } from '.';
import { createTaskAction } from '../app/slices/task';

const style = {
  padding: '2em'
};

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [warning, setWarning] = useState('');
  const [status, setStatus] = useState('pendente');
  const [lockButton, setLockButton] = useState(false);

  const dispatch = useDispatch();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'title') return setTitle(value);
    if (name === 'body') return setBody(value);
    if (name === 'status') return setStatus(value);
    return undefined;
  };

  const memoizedCallback = useCallback(() => {
    const validateCreateTask = (titleTask, bodyTask, statusTask) => {
      const statusOptions = ['em andamento', 'pendente', 'pronto'];
      const minTitleLength = 3;
      const minBodyLength = 3;

      const validateTitle = titleTask.length >= minTitleLength;
      const validateBody = bodyTask.length >= minBodyLength;
      const validateStatus = statusOptions.includes(statusTask);

      return validateStatus && validateTitle && validateBody;
    };

    if (validateCreateTask(title, body, status)) {
      setLockButton(false);
    } else {
      setLockButton(true);
    }
  }, [title, body, status]);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);

  const createTaskFunction = async () => {
    const token = localStorage.getItem('token');

    const { error, data } = await createTask(
      {
        title,
        body,
        status
      },
      token
    );
    if (!error) {
      data.task.your = true;
      dispatch(createTaskAction(data.task));
      return;
    }
    setWarning(`${error}, reload the page`);
    setTimeout(() => {
      setWarning('');
    }, 3000);
  };

  return (
    <div style={style}>
      <div className="form-create-task">
        <Warning warning={warning} />
        <div>
          <input
            data-testid="input-createTask-Title"
            type="text"
            name="title"
            className="form-control"
            id="InputTitle"
            value={title}
            onChange={handleChange}
            placeholder="Enter Title Task"
          />

          <select
            onChange={handleChange}
            name="status"
            value={status}
            data-testid="select-createTask-status"
            className="form-select custom-select"
            aria-label="Default select example">
            <option value="pendente">Pending</option>
            <option value="em andamento">In Progress</option>
            <option value="pronto">Ready</option>
          </select>
        </div>

        <div>
          <textarea
            type="text"
            name="body"
            data-testid="textArea-createTask-body"
            onChange={handleChange}
            className="form-control"
            placeholder="Task description"
            id="floatingTextarea"
            value={body}
          />

          <button
            className="btn submit-btn btn-success"
            type="button"
            onClick={createTaskFunction}
            disabled={lockButton}>
            CREATE TASK
          </button>
        </div>
      </div>
    </div>
  );
}
