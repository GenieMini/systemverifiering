import pytest
import unittest.mock as mock
from src.controllers.usercontroller import UserController

TEST_DAO_USER = {
    "_id": {
        "$oid": "642ed61cb51d9278d7bf589a"
    },
    "email": "test@gmail.se",
    "firstName": "sharif",
    "lastName": "outagourte"
}

def test_raise_invalid_email():
    mocked_object = mock.MagicMock()
    mocked_object.find.return_value = [TEST_DAO_USER]
    controller = UserController(dao=mocked_object)

    invalid_email = "invalid"
    with pytest.raises(ValueError):
        controller.get_user_by_email(email=invalid_email)

def test_dont_find_user():
    mocked_object = mock.MagicMock()
    mocked_object.find.return_value = [None]
    controller = UserController(dao=mocked_object)

    dont_find_email = "dont_find@gmail.com"
    result = controller.get_user_by_email(email=dont_find_email)
    assert result == None

def test_find_user():
    mocked_object = mock.MagicMock()
    mocked_object.find.return_value = [TEST_DAO_USER]
    uc = UserController(dao=mocked_object)

    valid_email = "test@gmail.se"
    result = uc.get_user_by_email(email=valid_email)
    assert result == TEST_DAO_USER
