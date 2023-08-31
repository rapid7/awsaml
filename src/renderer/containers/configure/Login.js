import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  InputGroup,
  Input,
  ListGroupItem,
  Button,
  Collapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDrag, useDrop } from 'react-dnd';
import {
  BORDER_COLOR_SCHEME_MEDIA_QUERY,
} from '../../constants/styles';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';

const ProfileInputGroup = styled(InputGroup)`
  width: 100%;
  height: 2.5em;
  line-height: 2.5em;
`;

const TransparentlistGroupItem = styled(ListGroupItem)`
  background-color: transparent;

  ${BORDER_COLOR_SCHEME_MEDIA_QUERY}
`;

const PaddedCollapse = styled(Collapse)`
  margin-top: 0.4rem;
`;

const LoginType = 'login';

function Login(props) {
  const {
    url,
    pretty,
    profileUuid,
    deleteCallback,
    errorHandler,
    darkMode,
    index,
    moveLogin,
  } = props;

  const [profileName, setProfileName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [caretDirection, setCaretDirection] = useState('right');

  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: LoginType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveLogin(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: LoginType,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleInputChange = ({ target: { value } }) => {
    setProfileName(value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode !== 32) { // Spacebar
      return;
    }
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.value += ' ';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      metadataUrl: url,
      profileName: profileName || pretty,
      profileUuid,
    };

    const {
      error,
      redirect,
    } = await window.electronAPI.login(payload);

    if (error) {
      errorHandler(error);
    }
    if (redirect) {
      document.location.replace(redirect);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const text = `Are you sure you want to delete the profile "${profileName || pretty}"?`;

    // eslint-disable-next-line no-alert
    if (window.confirm(text)) {
      const payload = {
        params: { profileUuid },
      };

      await window.electronAPI.deleteProfile({ profileUuid });
      deleteCallback(payload);
    }
  };

  const handleCollapse = () => {
    setCaretDirection(caretDirection === 'right' ? 'down' : 'right');
    setIsOpen(!isOpen);
  };

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity,
      }}
      data-handler-id={handlerId}
    >
      <TransparentlistGroupItem key={url}>
        <ProfileInputGroup>
          <Button
            onClick={handleCollapse}
            outline={!darkMode}
          >
            <FontAwesomeIcon icon={['fas', `fa-caret-${caretDirection}`]} />
          </Button>
          <Input
            className="form-control"
            defaultValue={pretty}
            name="profileName"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text"
          />
          <Button
            color="secondary"
            onClick={handleSubmit}
            outline={!darkMode}
          >
            Login
          </Button>
          <Button
            color="danger"
            onClick={handleDelete}
            outline={!darkMode}
          >
            <FontAwesomeIcon icon={['far', 'trash-alt']} />
          </Button>
        </ProfileInputGroup>
        <PaddedCollapse isOpen={isOpen}>
          <InputGroupWithCopyButton
            id={profileUuid}
            name={pretty}
            value={url}
            darkMode={darkMode}
          />
        </PaddedCollapse>
      </TransparentlistGroupItem>
    </div>
  );
}

Login.propTypes = {
  pretty: PropTypes.string,
  profileUuid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  moveLogin: PropTypes.func.isRequired,
};

Login.defaultProps = {
  pretty: '',
};

export default Login;
