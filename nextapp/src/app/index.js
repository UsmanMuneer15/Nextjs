import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Modal, Form, Input } from 'antd';
import moment from 'moment';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      startDate
      endDate
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String!, $startDate: String!, $endDate: String!) {
    createProject(name: $name, description: $description, startDate: $startDate, endDate: $endDate) {
      id
      name
      description
      startDate
      endDate
    }
  }
`;

const ProjectTable = ({ projects }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const onFinish = (values) => {
    createProject({
      variables: {
        name: values.name,
        description: values.description,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
        endDate: moment(values.endDate).format('YYYY-MM-DD'),
      },
    });
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button onClick={showModal}>View</Button>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={projects} columns={columns} />
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the project description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: 'Please select the start date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: 'Please select the end date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Create Project</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const Home = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const projects = data.projects;

  return (
    <div>
      <h1>Projects</h1>
      <ProjectTable projects={projects} />
    </div>
  );
};

export default Home;
