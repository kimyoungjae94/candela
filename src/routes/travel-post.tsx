import styled from 'styled-components';

const Form = styled.form``;

const TextArea = styled.textarea``;

const AttachFileBtn = styled.label``;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input``;

export default function PostTravelForm() {
  return (
    <Form>
      <TextArea placeholder='what is happening?!' />
      <AttachFileBtn htmlFor='file'>Add Photo</AttachFileBtn>
      <AttachFileInput type='file' id='file' accept='image/*' />
      <SubmitBtn type='submit' value='작성하기' />
    </Form>
  );
}
