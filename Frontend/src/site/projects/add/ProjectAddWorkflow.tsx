import { useState } from 'react';
import * as Yup from 'yup';
import { Workflow, type WorkflowStep } from '@/components/Workflow';
import { ProjectDetailsStep } from './steps/ProjectDetailsStep';
import { TeamAssignmentStep } from './steps/TeamAssignmentStep';
import { ReviewSummaryStep } from './steps/ReviewSummaryStep';
import { CompletionStep } from './steps/CompletionStep';

interface ProjectData {
  name: string;
  key: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
}

interface AddProjectWorkflowProps {
  onComplete: (data: ProjectData) => void;
  onCancel: () => void;
}

// Fake user data
const fakeUsers = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com' },
  { id: '4', name: 'Sarah Williams', email: 'sarah.williams@example.com' },
  { id: '5', name: 'David Brown', email: 'david.brown@example.com' },
  { id: '6', name: 'Emily Davis', email: 'emily.davis@example.com' },
];

// Yup validation schemas
const step1Schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Project name is required')
    .max(50, 'Project name must be 50 characters or less'),
  key: Yup.string()
    .trim()
    .required('Project key is required')
    .max(10, 'Project key must be 10 characters or less')
    .matches(/^[A-Z0-9]+$/, 'Project key can only contain uppercase letters and numbers'),
  description: Yup.string()
    .trim()
    .required('Description is required')
    .max(300, 'Description must be 300 characters or less'),
  icon: Yup.string().required('Icon is required'),
  color: Yup.string().required('Color is required'),
});

const step2Schema = Yup.object().shape({
  ownerId: Yup.string().required('Project owner is required'),
});

export const AddProjectWorkflow = ({ onComplete, onCancel }: AddProjectWorkflowProps) => {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    key: '',
    description: '',
    icon: 'Folder',
    color: '#0d6efd',
    ownerId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectData, string>>>({});

  const updateProjectData = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const step1Next = async () => {
    try {
      await step1Schema.validate(projectData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Partial<Record<keyof ProjectData, string>> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof ProjectData] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const step2Next = async () => {
    try {
      await step2Schema.validate(projectData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Partial<Record<keyof ProjectData, string>> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof ProjectData] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleComplete = () => {
    onComplete(projectData);
  };

  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Project Details',
      description: 'Basic information about your project',
      onNext: step1Next,
      content: (
        <ProjectDetailsStep
          projectData={projectData}
          errors={errors}
          updateProjectData={updateProjectData}
        />
      ),
    },
    {
      id: 2,
      title: 'Team',
      description: 'Assign project owner',
      onNext: step2Next,
      content: (
        <TeamAssignmentStep
          projectData={projectData}
          errors={errors}
          updateProjectData={updateProjectData}
          users={fakeUsers}
        />
      ),
    },
    {
      id: 3,
      title: 'Review & Summary',
      description: 'Review your project details',
      content: (
        <ReviewSummaryStep
          projectData={projectData}
          users={fakeUsers}
        />
      ),
    },
    {
      id: 4,
      title: 'Completed',
      description: 'Project created successfully',
      content: (
        <CompletionStep
          projectData={projectData}
          users={fakeUsers}
        />
      ),
    },
  ];

  return (
    <Workflow
      title="Add New Project"
      steps={steps}
      onComplete={handleComplete}
      onCancel={onCancel}
      completionButtonText="Create Project"
    />
  );
};

export default AddProjectWorkflow;
