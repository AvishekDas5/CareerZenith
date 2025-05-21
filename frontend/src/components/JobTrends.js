import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '900px',
    width: '100%',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: '#333',
  },
  chartContainer: {
    width: '100%',
    height: 'auto',
  },
};

// List of valid skills to filter by
const validSkills = [
  'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'php', 'ruby', 'swift', 'kotlin',
  'go', 'rust', 'sql', 'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express',
  'django', 'flask', 'spring', 'laravel', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
  'terraform', 'jenkins', 'git', 'jira', 'confluence', 'figma', 'sketch', 'adobe xd', 
  'photoshop', 'illustrator', 'data science', 'machine learning', 'artificial intelligence',
  'deep learning', 'nlp', 'computer vision', 'statistics', 'mongodb', 'postgresql', 'mysql',
  'oracle', 'redis', 'elasticsearch', 'graphql', 'rest api', 'microservices', 'devops',
  'agile', 'scrum', 'kanban', 'testing', 'qa', 'ci/cd', 'blockchain', 'big data', 'hadoop',
  'spark', 'tableau', 'power bi', 'excel', 'powerpoint', 'word', 'project management',
  'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
  'time management', 'r', 'matlab', 'scala', 'perl', 'bash', 'shell scripting', 'linux',
  'windows', 'ios', 'android', 'react native', 'flutter', 'unity', 'unreal engine',
  'game development', 'ui/ux design', 'responsive design', 'seo', 'digital marketing',
  'content writing', 'data analysis', 'data visualization', 'cybersecurity', 'network security',
  'ethical hacking', 'penetration testing', 'salesforce', 'sap', 'wordpress', 'shopify'
];

const JobTrends = () => {
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchTrendingSkills = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5002/api/trending_skills');
        const skillsArray = response.data || [];

        const frequency = {};
        skillsArray.forEach(skill => {
          const formatted = skill.toLowerCase();
          // Only count the skill if it's in our valid skills list
          if (validSkills.includes(formatted)) {
            frequency[formatted] = (frequency[formatted] || 0) + 1;
          }
        });

        const chartData = Object.entries(frequency)
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setSkillsData(chartData);
      } catch (error) {
        console.error('❌ Error fetching trending skills:', error);
      }
    };

    fetchTrendingSkills();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Top Trending Skills</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="skill" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default JobTrends;