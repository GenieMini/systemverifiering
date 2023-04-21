import pytest
import os
import shutil

from pymongo.errors import WriteError

from src.util.dao import DAO

class TestDAO():
    @pytest.fixture
    def sut(self):
        """ 
            Reads validators/user.json and copies it so we can use it for DAO.
        """
        # Dummy file for DAO.__init__() to create a new collection
        json_test_filename = '.\\src\\static\\validators\\test.json'
        # Path for schema used for test
        validator_path = f'.\\src\\static\\validators\\user.json'

        shutil.copy(validator_path, json_test_filename)

        # Create DAO with schema of the selected dummy file
        dao = DAO("test")

        yield dao

        dao.drop()
        os.remove(json_test_filename)

    def test_create_valid(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": "johnny",
            "lastName": "test",
            "email": "johnny.test@test.com",
            }

        content = sut.create(dummy_user)

        assert content["firstName"] == "johnny"
        assert content["lastName"] == "test"
        assert content["email"] == "johnny.test@test.com"

    """
        Missing values
    """

    def test_create_without_firstName(self, sut):
        # sut is dao
        dummy_user = {
            "lastName": "test",
            "email": "johnny.test@test.com",
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    def test_create_without_lastName(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": "johnny",
            "email": "johnny.test@test.com",
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    def test_create_without_email(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": "johnny",
            "lastName": "test",
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    def test_create_without_anything(self, sut):
        # sut is dao
        dummy_user = {}

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    """
        Incorrect Bson
    """

    def test_create_with_incorrect_firstName(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": 123,
            "lastName": "test",
            "email": "johnny.test@test.com",
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    def test_create_with_incorrect_lastName(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": "johnny",
            "lastName": 123,
            "email": "johnny.test@test.com",
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    def test_create_with_incorrect_email(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": "johnny",
            "lastName": "test",
            "email": 123,
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)

    def test_create_with_incorrect_everything(self, sut):
        # sut is dao
        dummy_user = {
            "firstName": 123,
            "lastName": 123,
            "email": 123,
            }

        with pytest.raises(WriteError):
            sut.create(dummy_user)