import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Label from '../components/ui/Label';
import FormRow from '../components/ui/FormRow';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import LineChartCard from '../components/ui/LineChartCard';
import BarChartCard from '../components/ui/BarChartCard';
import DonutChartCard from '../components/ui/DonutChartCard';
import Table from '../components/ui/Table';
import NotificationItem from '../components/ui/NotificationItem';
import { Plus, Mail, Search, Inbox, Download } from 'lucide-react';

const ComponentShowcase = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  
  // Chart data
  const lineChartData = [
    { label: 'Mon', value: 20 },
    { label: 'Tue', value: 35 },
    { label: 'Wed', value: 28 },
    { label: 'Thu', value: 45 },
    { label: 'Fri', value: 38 },
    { label: 'Sat', value: 52 },
    { label: 'Sun', value: 48 },
  ];
  
  const barChartData = [
    { label: 'React', value: 45, unit: 'h' },
    { label: 'TypeScript', value: 28, unit: 'h' },
    { label: 'Node.js', value: 38, unit: 'h' },
    { label: 'Python', value: 52, unit: 'h' },
  ];
  
  const donutChartData = [
    { label: 'Frontend', value: 120 },
    { label: 'Backend', value: 80 },
    { label: 'Design', value: 40 },
    { label: 'DevOps', value: 30 },
  ];
  
  // Table data
  const tableColumns = [
    { header: 'Name', key: 'name' },
    { 
      header: 'Status', 
      key: 'status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'success' : 'default'}>
          {value}
        </Badge>
      )
    },
    { header: 'Progress', key: 'progress', align: 'right' },
    { 
      header: 'Actions', 
      key: 'actions',
      align: 'center',
      render: () => (
        <Button variant="ghost" size="sm">View</Button>
      )
    },
  ];
  
  const tableData = [
    { name: 'React.js', status: 'Active', progress: '65%' },
    { name: 'TypeScript', status: 'Active', progress: '35%' },
    { name: 'Python', status: 'Completed', progress: '100%' },
  ];
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Component Showcase"
        description="Complete UI component library with all available components"
        actionLabel="Add New"
        actionIcon={Plus}
        onAction={() => alert('Action clicked!')}
      />
      
      {/* Form Components */}
      <Section title="Form Components" description="Input fields and form elements">
        <Card className="p-6">
          <FormRow columns={2} gap={4} className="mb-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              icon={Mail}
              helperText="We'll never share your email"
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              required
            />
          </FormRow>
          
          <FormRow columns={2} gap={4} className="mb-4">
            <Select
              label="Select Level"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                'Beginner',
                'Intermediate',
                'Advanced',
                'Expert'
              ]}
              placeholder="Choose your level"
            />
            
            <Input
              label="Search"
              type="text"
              placeholder="Search skills..."
              icon={Search}
            />
          </FormRow>
          
          <Textarea
            label="Description"
            placeholder="Write a description..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={4}
            maxLength={200}
            showCount
            helperText="Describe what you want to learn"
          />
          
          <div className="mt-4 flex items-center space-x-3">
            <Button variant="primary">Submit</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Reset</Button>
          </div>
        </Card>
      </Section>
      
      {/* Badges */}
      <Section title="Badges" description="Status and category indicators">
        <Card className="p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="purple">Purple</Badge>
          </div>
        </Card>
      </Section>
      
      {/* Charts */}
      <Section title="Charts" description="Data visualization components">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LineChartCard
            title="Weekly Activity"
            description="Hours per day this week"
            data={lineChartData}
            color="indigo"
          />
          
          <BarChartCard
            title="Skills Progress"
            description="Total hours logged"
            data={barChartData}
            color="blue"
          />
        </div>
        
        <DonutChartCard
          title="Category Distribution"
          description="Time spent by category"
          data={donutChartData}
        />
      </Section>
      
      {/* Table */}
      <Section title="Table" description="Data table with rows and columns">
        <Table
          columns={tableColumns}
          data={tableData}
          hoverable
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </Section>
      
      {/* Notifications */}
      <Section title="Notifications" description="Notification item components">
        <Card className="p-4">
          <div className="space-y-3">
            <NotificationItem
              type="success"
              title="Skill Completed!"
              message="You've successfully completed React.js"
              timestamp="2 minutes ago"
              action={{ label: 'View', onClick: () => {} }}
              onDismiss={() => {}}
            />
            
            <NotificationItem
              type="info"
              title="New Achievement Unlocked"
              message="You've maintained a 7-day streak!"
              timestamp="1 hour ago"
              read
            />
            
            <NotificationItem
              type="warning"
              title="Goal Deadline Approaching"
              message="Your 'Master React' goal is due in 3 days"
              timestamp="3 hours ago"
              action={{ label: 'Update', onClick: () => {} }}
            />
            
            <NotificationItem
              type="error"
              title="Session Sync Failed"
              message="Unable to sync your latest session"
              timestamp="Yesterday"
              action={{ label: 'Retry', onClick: () => {} }}
              onDismiss={() => {}}
            />
          </div>
        </Card>
      </Section>
      
      {/* Empty State */}
      <Section title="Empty State" description="No data placeholder">
        <EmptyState
          icon={Inbox}
          title="No skills yet"
          description="Get started by adding your first learning skill"
          actionLabel="Add First Skill"
          actionIcon={Plus}
          onAction={() => alert('Add skill clicked!')}
          secondary={{
            label: 'Import Skills',
            onClick: () => alert('Import clicked!')
          }}
        />
      </Section>
    </div>
  );
};

export default ComponentShowcase;
