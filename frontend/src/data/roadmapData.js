export const ROADMAPS = {
  react: {
    id: 'react',
    title: 'React',
    description: 'Step by step guide to becoming a modern React developer',
    icon: '⚛️',
    url: 'https://roadmap.sh/react',
    color: '#61DAFB',
    sections: [
      {
        id: 'fundamentals',
        title: 'React Fundamentals',
        topics: [
          { id: 'components', title: 'Components', description: 'Building blocks of React apps — functional and class components', url: 'https://roadmap.sh/react', resources: [{ label: 'React Docs', url: 'https://react.dev/learn#components' }] },
          { id: 'jsx', title: 'JSX', description: 'JavaScript XML syntax for describing UI', url: 'https://roadmap.sh/react', resources: [{ label: 'Introducing JSX', url: 'https://react.dev/learn/writing-markup-with-jsx' }] },
          { id: 'props', title: 'Props', description: 'Pass data between components', url: 'https://roadmap.sh/react', resources: [{ label: 'Passing Props', url: 'https://react.dev/learn/passing-props-to-a-component' }] },
          { id: 'state', title: 'State', description: 'Manage dynamic data within components', url: 'https://roadmap.sh/react', resources: [{ label: 'State & Lifecycle', url: 'https://react.dev/learn/state-a-components-memory' }] },
          { id: 'conditional-rendering', title: 'Conditional Rendering', description: 'Render different UI based on conditions', url: 'https://roadmap.sh/react', resources: [{ label: 'Conditional Rendering', url: 'https://react.dev/learn/conditional-rendering' }] },
          { id: 'lists-keys', title: 'Lists and Keys', description: 'Rendering lists of data efficiently', url: 'https://roadmap.sh/react', resources: [{ label: 'Lists & Keys', url: 'https://react.dev/learn/rendering-lists' }] },
        ]
      },
      {
        id: 'hooks',
        title: 'React Hooks',
        topics: [
          { id: 'usestate', title: 'useState', description: 'Add state to functional components', url: 'https://roadmap.sh/react', resources: [{ label: 'useState Hook', url: 'https://react.dev/reference/react/useState' }] },
          { id: 'useeffect', title: 'useEffect', description: 'Handle side effects in components', url: 'https://roadmap.sh/react', resources: [{ label: 'useEffect Hook', url: 'https://react.dev/reference/react/useEffect' }] },
          { id: 'usecontext', title: 'useContext', description: 'Access context without prop drilling', url: 'https://roadmap.sh/react', resources: [{ label: 'useContext', url: 'https://react.dev/reference/react/useContext' }] },
          { id: 'usereducer', title: 'useReducer', description: 'Complex state management with reducers', url: 'https://roadmap.sh/react', resources: [{ label: 'useReducer', url: 'https://react.dev/reference/react/useReducer' }] },
          { id: 'usememo', title: 'useMemo & useCallback', description: 'Memoize values and callbacks for performance', url: 'https://roadmap.sh/react', resources: [{ label: 'useMemo', url: 'https://react.dev/reference/react/useMemo' }] },
          { id: 'custom-hooks', title: 'Custom Hooks', description: 'Extract reusable logic into custom hooks', url: 'https://roadmap.sh/react', resources: [{ label: 'Custom Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' }] },
        ]
      },
      {
        id: 'state-management',
        title: 'State Management',
        topics: [
          { id: 'context-api', title: 'Context API', description: 'Built-in React state sharing mechanism', url: 'https://roadmap.sh/react', resources: [{ label: 'Context API', url: 'https://react.dev/learn/passing-data-deeply-with-context' }] },
          { id: 'redux', title: 'Redux / Redux Toolkit', description: 'Predictable state container for JS apps', url: 'https://roadmap.sh/react', resources: [{ label: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' }] },
          { id: 'zustand', title: 'Zustand', description: 'Lightweight state management', url: 'https://roadmap.sh/react', resources: [{ label: 'Zustand', url: 'https://zustand-demo.pmnd.rs/' }] },
        ]
      },
      {
        id: 'routing',
        title: 'Routing',
        topics: [
          { id: 'react-router', title: 'React Router', description: 'Client-side routing for React apps', url: 'https://roadmap.sh/react', resources: [{ label: 'React Router', url: 'https://reactrouter.com/' }] },
          { id: 'tanstack-router', title: 'TanStack Router', description: 'Type-safe routing solution', url: 'https://roadmap.sh/react', resources: [{ label: 'TanStack Router', url: 'https://tanstack.com/router' }] },
        ]
      },
      {
        id: 'api-calls',
        title: 'API Calls',
        topics: [
          { id: 'fetch-axios', title: 'fetch / Axios', description: 'Making HTTP requests to APIs', url: 'https://roadmap.sh/react', resources: [{ label: 'Axios', url: 'https://axios-http.com/' }] },
          { id: 'tanstack-query', title: 'TanStack Query', description: 'Powerful data fetching & caching', url: 'https://roadmap.sh/react', resources: [{ label: 'TanStack Query', url: 'https://tanstack.com/query' }] },
          { id: 'swr', title: 'SWR', description: 'React hooks for data fetching by Vercel', url: 'https://roadmap.sh/react', resources: [{ label: 'SWR', url: 'https://swr.vercel.app/' }] },
        ]
      },
      {
        id: 'styling',
        title: 'Styling',
        topics: [
          { id: 'css-modules', title: 'CSS Modules', description: 'Scoped CSS for React components', url: 'https://roadmap.sh/react', resources: [{ label: 'CSS Modules', url: 'https://github.com/css-modules/css-modules' }] },
          { id: 'tailwind', title: 'Tailwind CSS', description: 'Utility-first CSS framework', url: 'https://roadmap.sh/react', resources: [{ label: 'Tailwind CSS', url: 'https://tailwindcss.com/' }] },
          { id: 'styled-components', title: 'Styled Components', description: 'CSS-in-JS library', url: 'https://roadmap.sh/react', resources: [{ label: 'Styled Components', url: 'https://styled-components.com/' }] },
        ]
      },
      {
        id: 'testing',
        title: 'Testing',
        topics: [
          { id: 'vitest', title: 'Vitest / Jest', description: 'Unit and integration testing frameworks', url: 'https://roadmap.sh/react', resources: [{ label: 'Vitest', url: 'https://vitest.dev/' }] },
          { id: 'react-testing-library', title: 'React Testing Library', description: 'Test React components with user-centric approach', url: 'https://roadmap.sh/react', resources: [{ label: 'Testing Library', url: 'https://testing-library.com/react' }] },
          { id: 'playwright', title: 'Playwright / Cypress', description: 'End-to-end testing tools', url: 'https://roadmap.sh/react', resources: [{ label: 'Playwright', url: 'https://playwright.dev/' }] },
        ]
      },
      {
        id: 'frameworks',
        title: 'Frameworks',
        topics: [
          { id: 'nextjs', title: 'Next.js', description: 'Full-stack React framework with SSR', url: 'https://roadmap.sh/react', resources: [{ label: 'Next.js', url: 'https://nextjs.org/' }] },
          { id: 'remix', title: 'Remix', description: 'Full stack web framework', url: 'https://roadmap.sh/react', resources: [{ label: 'Remix', url: 'https://remix.run/' }] },
          { id: 'astro', title: 'Astro', description: 'Content-focused web framework', url: 'https://roadmap.sh/react', resources: [{ label: 'Astro', url: 'https://astro.build/' }] },
        ]
      },
    ]
  },

  javascript: {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Complete guide to becoming a JavaScript developer',
    icon: '🟨',
    url: 'https://roadmap.sh/javascript',
    color: '#F7DF1E',
    sections: [
      {
        id: 'basics',
        title: 'JavaScript Basics',
        topics: [
          { id: 'variables', title: 'Variables & Data Types', description: 'var, let, const and primitive/reference types', url: 'https://roadmap.sh/javascript', resources: [{ label: 'MDN Variables', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables' }] },
          { id: 'operators', title: 'Operators & Expressions', description: 'Arithmetic, comparison, logical operators', url: 'https://roadmap.sh/javascript', resources: [{ label: 'MDN Expressions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators' }] },
          { id: 'control-flow', title: 'Control Flow', description: 'if/else, switch, loops (for, while, for...of)', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Control Flow', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling' }] },
          { id: 'functions', title: 'Functions', description: 'Declarations, expressions, arrow functions, closures', url: 'https://roadmap.sh/javascript', resources: [{ label: 'MDN Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' }] },
          { id: 'scope', title: 'Scope & Hoisting', description: 'Block scope, function scope, lexical scope', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Scope', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Scope' }] },
        ]
      },
      {
        id: 'data-structures',
        title: 'Data Structures',
        topics: [
          { id: 'arrays', title: 'Arrays', description: 'Array methods: map, filter, reduce, forEach', url: 'https://roadmap.sh/javascript', resources: [{ label: 'MDN Arrays', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' }] },
          { id: 'objects', title: 'Objects', description: 'Object creation, manipulation, destructuring', url: 'https://roadmap.sh/javascript', resources: [{ label: 'MDN Objects', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object' }] },
          { id: 'maps-sets', title: 'Maps & Sets', description: 'Map, Set, WeakMap, WeakSet', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Map & Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' }] },
        ]
      },
      {
        id: 'advanced',
        title: 'Advanced Concepts',
        topics: [
          { id: 'closures', title: 'Closures', description: 'Functions with access to outer scope', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' }] },
          { id: 'prototypes', title: 'Prototypes & Inheritance', description: 'Prototype chain, Object.create, classes', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Prototypes', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes' }] },
          { id: 'this-keyword', title: 'this Keyword', description: 'Context binding, call, apply, bind', url: 'https://roadmap.sh/javascript', resources: [{ label: 'this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' }] },
          { id: 'event-loop', title: 'Event Loop', description: 'How JavaScript handles async code', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Event Loop', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' }] },
        ]
      },
      {
        id: 'async',
        title: 'Asynchronous JavaScript',
        topics: [
          { id: 'callbacks', title: 'Callbacks', description: 'Functions passed as arguments', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Callbacks', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Callback_function' }] },
          { id: 'promises', title: 'Promises', description: 'Handle async operations with then/catch', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Promises', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' }] },
          { id: 'async-await', title: 'Async/Await', description: 'Syntactic sugar for Promises', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Async/Await', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises' }] },
          { id: 'fetch-api', title: 'Fetch API', description: 'Browser API for HTTP requests', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' }] },
        ]
      },
      {
        id: 'dom',
        title: 'DOM & Browser APIs',
        topics: [
          { id: 'dom-manipulation', title: 'DOM Manipulation', description: 'Select, create, modify DOM elements', url: 'https://roadmap.sh/javascript', resources: [{ label: 'DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model' }] },
          { id: 'events', title: 'Events', description: 'Event handling, bubbling, delegation', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Events', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events' }] },
          { id: 'storage', title: 'Web Storage', description: 'localStorage, sessionStorage, cookies', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Web Storage', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API' }] },
        ]
      },
      {
        id: 'es6-plus',
        title: 'ES6+ Features',
        topics: [
          { id: 'destructuring', title: 'Destructuring', description: 'Extract values from arrays and objects', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Destructuring', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment' }] },
          { id: 'spread-rest', title: 'Spread & Rest', description: 'Spread syntax and rest parameters', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Spread', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax' }] },
          { id: 'modules', title: 'Modules', description: 'import/export, ES modules', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' }] },
          { id: 'template-literals', title: 'Template Literals', description: 'String interpolation and tagged templates', url: 'https://roadmap.sh/javascript', resources: [{ label: 'Template Literals', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals' }] },
        ]
      },
    ]
  },

  python: {
    id: 'python',
    title: 'Python',
    description: 'Complete roadmap to becoming a Python developer',
    icon: '🐍',
    url: 'https://roadmap.sh/python',
    color: '#3776AB',
    sections: [
      {
        id: 'basics',
        title: 'Python Basics',
        topics: [
          { id: 'syntax', title: 'Basic Syntax', description: 'Variables, indentation, comments, I/O', url: 'https://roadmap.sh/python', resources: [{ label: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/' }] },
          { id: 'data-types', title: 'Data Types', description: 'Strings, numbers, booleans, None', url: 'https://roadmap.sh/python', resources: [{ label: 'Built-in Types', url: 'https://docs.python.org/3/library/stdtypes.html' }] },
          { id: 'control-flow', title: 'Control Flow', description: 'if/elif/else, for/while loops, comprehensions', url: 'https://roadmap.sh/python', resources: [{ label: 'Control Flow', url: 'https://docs.python.org/3/tutorial/controlflow.html' }] },
          { id: 'functions', title: 'Functions', description: 'def, args, kwargs, lambda, decorators', url: 'https://roadmap.sh/python', resources: [{ label: 'Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' }] },
        ]
      },
      {
        id: 'data-structures',
        title: 'Data Structures',
        topics: [
          { id: 'lists-tuples', title: 'Lists & Tuples', description: 'Ordered collections, list comprehensions', url: 'https://roadmap.sh/python', resources: [{ label: 'Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html' }] },
          { id: 'dicts-sets', title: 'Dictionaries & Sets', description: 'Key-value pairs and unique collections', url: 'https://roadmap.sh/python', resources: [{ label: 'Dictionaries', url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' }] },
        ]
      },
      {
        id: 'oop',
        title: 'Object-Oriented Programming',
        topics: [
          { id: 'classes', title: 'Classes & Objects', description: 'Class definition, __init__, self', url: 'https://roadmap.sh/python', resources: [{ label: 'Classes', url: 'https://docs.python.org/3/tutorial/classes.html' }] },
          { id: 'inheritance', title: 'Inheritance', description: 'Single/multiple inheritance, super()', url: 'https://roadmap.sh/python', resources: [{ label: 'Inheritance', url: 'https://docs.python.org/3/tutorial/classes.html#inheritance' }] },
          { id: 'magic-methods', title: 'Magic Methods', description: '__str__, __repr__, __len__, dunder methods', url: 'https://roadmap.sh/python', resources: [{ label: 'Special Methods', url: 'https://docs.python.org/3/reference/datamodel.html#special-method-names' }] },
        ]
      },
      {
        id: 'advanced',
        title: 'Advanced Python',
        topics: [
          { id: 'generators', title: 'Generators & Iterators', description: 'yield, iter, next, generator expressions', url: 'https://roadmap.sh/python', resources: [{ label: 'Generators', url: 'https://docs.python.org/3/tutorial/classes.html#generators' }] },
          { id: 'decorators', title: 'Decorators', description: 'Function and class decorators', url: 'https://roadmap.sh/python', resources: [{ label: 'Decorators', url: 'https://realpython.com/primer-on-python-decorators/' }] },
          { id: 'context-managers', title: 'Context Managers', description: 'with statement, __enter__/__exit__', url: 'https://roadmap.sh/python', resources: [{ label: 'Context Managers', url: 'https://docs.python.org/3/reference/datamodel.html#context-managers' }] },
          { id: 'async', title: 'Async Programming', description: 'asyncio, async/await, coroutines', url: 'https://roadmap.sh/python', resources: [{ label: 'asyncio', url: 'https://docs.python.org/3/library/asyncio.html' }] },
        ]
      },
      {
        id: 'packages',
        title: 'Package Management & Testing',
        topics: [
          { id: 'pip-venv', title: 'pip & Virtual Environments', description: 'Package installation and virtual envs', url: 'https://roadmap.sh/python', resources: [{ label: 'pip', url: 'https://pip.pypa.io/' }] },
          { id: 'testing', title: 'Testing', description: 'unittest, pytest, test-driven development', url: 'https://roadmap.sh/python', resources: [{ label: 'pytest', url: 'https://docs.pytest.org/' }] },
        ]
      },
      {
        id: 'frameworks',
        title: 'Frameworks & Libraries',
        topics: [
          { id: 'django', title: 'Django', description: 'Full-featured web framework', url: 'https://roadmap.sh/python', resources: [{ label: 'Django', url: 'https://www.djangoproject.com/' }] },
          { id: 'flask', title: 'Flask / FastAPI', description: 'Lightweight web frameworks', url: 'https://roadmap.sh/python', resources: [{ label: 'FastAPI', url: 'https://fastapi.tiangolo.com/' }] },
          { id: 'numpy-pandas', title: 'NumPy & Pandas', description: 'Data analysis and scientific computing', url: 'https://roadmap.sh/python', resources: [{ label: 'NumPy', url: 'https://numpy.org/' }] },
        ]
      },
    ]
  },

  java: {
    id: 'java',
    title: 'Java',
    description: 'Comprehensive roadmap for Java developers',
    icon: '☕',
    url: 'https://roadmap.sh/java',
    color: '#ED8B00',
    sections: [
      {
        id: 'fundamentals',
        title: 'Java Fundamentals',
        topics: [
          { id: 'syntax', title: 'Basic Syntax', description: 'Variables, data types, operators, I/O', url: 'https://roadmap.sh/java', resources: [{ label: 'Java Tutorial', url: 'https://docs.oracle.com/javase/tutorial/' }] },
          { id: 'control-flow', title: 'Control Flow', description: 'if/else, switch, for, while, do-while', url: 'https://roadmap.sh/java', resources: [{ label: 'Control Flow', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html' }] },
          { id: 'arrays', title: 'Arrays & Strings', description: 'Array operations, String methods, StringBuilder', url: 'https://roadmap.sh/java', resources: [{ label: 'Arrays', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html' }] },
          { id: 'methods', title: 'Methods', description: 'Method declaration, overloading, varargs', url: 'https://roadmap.sh/java', resources: [{ label: 'Methods', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html' }] },
        ]
      },
      {
        id: 'oop',
        title: 'Object-Oriented Programming',
        topics: [
          { id: 'classes-objects', title: 'Classes & Objects', description: 'Class creation, constructors, access modifiers', url: 'https://roadmap.sh/java', resources: [{ label: 'Classes', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html' }] },
          { id: 'inheritance', title: 'Inheritance', description: 'extends, super, method overriding', url: 'https://roadmap.sh/java', resources: [{ label: 'Inheritance', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html' }] },
          { id: 'interfaces', title: 'Interfaces & Abstract Classes', description: 'Contracts and partial implementations', url: 'https://roadmap.sh/java', resources: [{ label: 'Interfaces', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html' }] },
          { id: 'polymorphism', title: 'Polymorphism', description: 'Runtime and compile-time polymorphism', url: 'https://roadmap.sh/java', resources: [{ label: 'Polymorphism', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html' }] },
          { id: 'encapsulation', title: 'Encapsulation', description: 'Getters, setters, access control', url: 'https://roadmap.sh/java', resources: [{ label: 'Encapsulation', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html' }] },
        ]
      },
      {
        id: 'collections',
        title: 'Collections Framework',
        topics: [
          { id: 'list', title: 'List (ArrayList, LinkedList)', description: 'Ordered collections', url: 'https://roadmap.sh/java', resources: [{ label: 'List', url: 'https://docs.oracle.com/javase/tutorial/collections/interfaces/list.html' }] },
          { id: 'set-map', title: 'Set & Map', description: 'HashSet, TreeSet, HashMap, TreeMap', url: 'https://roadmap.sh/java', resources: [{ label: 'Collections', url: 'https://docs.oracle.com/javase/tutorial/collections/' }] },
          { id: 'iterators', title: 'Iterators & Streams', description: 'Traversing and processing collections', url: 'https://roadmap.sh/java', resources: [{ label: 'Streams', url: 'https://docs.oracle.com/javase/tutorial/collections/streams/' }] },
        ]
      },
      {
        id: 'advanced',
        title: 'Advanced Java',
        topics: [
          { id: 'generics', title: 'Generics', description: 'Type parameters, bounded types, wildcards', url: 'https://roadmap.sh/java', resources: [{ label: 'Generics', url: 'https://docs.oracle.com/javase/tutorial/java/generics/' }] },
          { id: 'exceptions', title: 'Exception Handling', description: 'try/catch/finally, custom exceptions', url: 'https://roadmap.sh/java', resources: [{ label: 'Exceptions', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' }] },
          { id: 'lambdas', title: 'Lambda Expressions', description: 'Functional interfaces, method references', url: 'https://roadmap.sh/java', resources: [{ label: 'Lambdas', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html' }] },
          { id: 'multithreading', title: 'Multithreading', description: 'Thread, Runnable, ExecutorService, synchronized', url: 'https://roadmap.sh/java', resources: [{ label: 'Concurrency', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/' }] },
        ]
      },
      {
        id: 'build-tools',
        title: 'Build Tools & Frameworks',
        topics: [
          { id: 'maven-gradle', title: 'Maven / Gradle', description: 'Build automation and dependency management', url: 'https://roadmap.sh/java', resources: [{ label: 'Maven', url: 'https://maven.apache.org/guides/' }] },
          { id: 'spring-boot', title: 'Spring Boot', description: 'Enterprise Java framework', url: 'https://roadmap.sh/java', resources: [{ label: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' }] },
          { id: 'testing', title: 'JUnit & Mockito', description: 'Unit and integration testing', url: 'https://roadmap.sh/java', resources: [{ label: 'JUnit 5', url: 'https://junit.org/junit5/' }] },
        ]
      },
    ]
  },

  nodejs: {
    id: 'nodejs',
    title: 'Node.js',
    description: 'Roadmap to becoming a Node.js developer',
    icon: '🟢',
    url: 'https://roadmap.sh/nodejs',
    color: '#339933',
    sections: [
      {
        id: 'fundamentals',
        title: 'Node.js Fundamentals',
        topics: [
          { id: 'what-is-node', title: 'What is Node.js?', description: 'JavaScript runtime built on V8 engine', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Node.js Intro', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' }] },
          { id: 'modules', title: 'Modules System', description: 'CommonJS, ES Modules, require vs import', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Modules', url: 'https://nodejs.org/api/modules.html' }] },
          { id: 'npm', title: 'npm / yarn / pnpm', description: 'Package managers and package.json', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'npm', url: 'https://docs.npmjs.com/' }] },
          { id: 'event-loop', title: 'Event Loop', description: 'Non-blocking I/O and event-driven architecture', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Event Loop', url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick' }] },
        ]
      },
      {
        id: 'core-modules',
        title: 'Core Modules',
        topics: [
          { id: 'fs', title: 'File System (fs)', description: 'Read, write, and manage files', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'fs Module', url: 'https://nodejs.org/api/fs.html' }] },
          { id: 'path', title: 'Path Module', description: 'File and directory path utilities', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'path Module', url: 'https://nodejs.org/api/path.html' }] },
          { id: 'http', title: 'HTTP Module', description: 'Create HTTP servers and make requests', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'HTTP', url: 'https://nodejs.org/api/http.html' }] },
          { id: 'streams', title: 'Streams', description: 'Process data in chunks', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Streams', url: 'https://nodejs.org/api/stream.html' }] },
        ]
      },
      {
        id: 'frameworks',
        title: 'Web Frameworks',
        topics: [
          { id: 'express', title: 'Express.js', description: 'Minimal and flexible web framework', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Express', url: 'https://expressjs.com/' }] },
          { id: 'nestjs', title: 'NestJS', description: 'Progressive Node.js framework with TypeScript', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'NestJS', url: 'https://nestjs.com/' }] },
          { id: 'fastify', title: 'Fastify', description: 'High-performance web framework', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Fastify', url: 'https://fastify.dev/' }] },
        ]
      },
      {
        id: 'databases',
        title: 'Databases',
        topics: [
          { id: 'sql-db', title: 'SQL Databases', description: 'PostgreSQL, MySQL with Sequelize/Prisma', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Prisma', url: 'https://www.prisma.io/' }] },
          { id: 'nosql', title: 'NoSQL Databases', description: 'MongoDB with Mongoose', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Mongoose', url: 'https://mongoosejs.com/' }] },
          { id: 'orm', title: 'ORMs', description: 'Prisma, Sequelize, TypeORM', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'TypeORM', url: 'https://typeorm.io/' }] },
        ]
      },
      {
        id: 'auth-security',
        title: 'Authentication & Security',
        topics: [
          { id: 'jwt', title: 'JWT Authentication', description: 'JSON Web Tokens for auth', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'JWT', url: 'https://jwt.io/' }] },
          { id: 'oauth', title: 'OAuth 2.0', description: 'Third-party authentication flows', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Passport.js', url: 'https://www.passportjs.org/' }] },
          { id: 'security', title: 'Security Best Practices', description: 'CORS, helmet, rate limiting, input validation', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Security', url: 'https://expressjs.com/en/advanced/best-practice-security.html' }] },
        ]
      },
      {
        id: 'testing-deploy',
        title: 'Testing & Deployment',
        topics: [
          { id: 'testing', title: 'Testing', description: 'Jest, Mocha, Supertest', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Jest', url: 'https://jestjs.io/' }] },
          { id: 'docker', title: 'Docker', description: 'Containerize Node.js applications', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'Docker & Node', url: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp' }] },
          { id: 'ci-cd', title: 'CI/CD', description: 'GitHub Actions, Jenkins pipelines', url: 'https://roadmap.sh/nodejs', resources: [{ label: 'GitHub Actions', url: 'https://docs.github.com/en/actions' }] },
        ]
      },
    ]
  },

  typescript: {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Complete guide to TypeScript for JavaScript developers',
    icon: '🔷',
    url: 'https://roadmap.sh/typescript',
    color: '#3178C6',
    sections: [
      { id: 'basics', title: 'TypeScript Basics', topics: [
        { id: 'setup', title: 'Setup & Configuration', description: 'tsconfig.json, compiler options', url: 'https://roadmap.sh/typescript', resources: [{ label: 'TS Config', url: 'https://www.typescriptlang.org/tsconfig' }] },
        { id: 'basic-types', title: 'Basic Types', description: 'string, number, boolean, array, tuple, enum', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Basic Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' }] },
        { id: 'interfaces', title: 'Interfaces', description: 'Define object shapes and contracts', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Interfaces', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' }] },
        { id: 'type-annotations', title: 'Type Annotations', description: 'Variable, function, parameter types', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Annotations', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' }] },
      ]},
      { id: 'advanced-types', title: 'Advanced Types', topics: [
        { id: 'union-intersection', title: 'Union & Intersection', description: 'Combine types with | and &', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Union Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types' }] },
        { id: 'generics', title: 'Generics', description: 'Reusable type-safe components', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' }] },
        { id: 'utility-types', title: 'Utility Types', description: 'Partial, Required, Pick, Omit, Record', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' }] },
        { id: 'mapped-types', title: 'Mapped & Conditional Types', description: 'Transform types programmatically', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Mapped Types', url: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html' }] },
      ]},
      { id: 'oop-ts', title: 'OOP & Modules', topics: [
        { id: 'classes', title: 'Classes', description: 'Access modifiers, abstract classes, decorators', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Classes', url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html' }] },
        { id: 'modules', title: 'Modules', description: 'import/export, module resolution, .d.ts files', url: 'https://roadmap.sh/typescript', resources: [{ label: 'Modules', url: 'https://www.typescriptlang.org/docs/handbook/2/modules.html' }] },
      ]},
    ]
  },

  docker: {
    id: 'docker',
    title: 'Docker',
    description: 'Learn containerization with Docker from basics to production',
    icon: '🐳',
    url: 'https://roadmap.sh/docker',
    color: '#2496ED',
    sections: [
      { id: 'basics', title: 'Docker Basics', topics: [
        { id: 'what-is-docker', title: 'What is Docker?', description: 'Containers vs VMs, Docker architecture', url: 'https://roadmap.sh/docker', resources: [{ label: 'Docker Overview', url: 'https://docs.docker.com/get-started/overview/' }] },
        { id: 'images', title: 'Docker Images', description: 'Pull, build, tag, and push images', url: 'https://roadmap.sh/docker', resources: [{ label: 'Images', url: 'https://docs.docker.com/engine/reference/commandline/images/' }] },
        { id: 'containers', title: 'Docker Containers', description: 'Run, stop, remove, exec into containers', url: 'https://roadmap.sh/docker', resources: [{ label: 'Containers', url: 'https://docs.docker.com/engine/reference/commandline/container/' }] },
      ]},
      { id: 'dockerfile', title: 'Dockerfile & Building', topics: [
        { id: 'dockerfile-basics', title: 'Dockerfile', description: 'FROM, RUN, COPY, EXPOSE, CMD instructions', url: 'https://roadmap.sh/docker', resources: [{ label: 'Dockerfile Reference', url: 'https://docs.docker.com/engine/reference/builder/' }] },
        { id: 'multi-stage', title: 'Multi-stage Builds', description: 'Optimize image size with multi-stage builds', url: 'https://roadmap.sh/docker', resources: [{ label: 'Multi-stage', url: 'https://docs.docker.com/build/building/multi-stage/' }] },
      ]},
      { id: 'networking-storage', title: 'Networking & Storage', topics: [
        { id: 'networking', title: 'Docker Networking', description: 'Bridge, host, overlay networks', url: 'https://roadmap.sh/docker', resources: [{ label: 'Networking', url: 'https://docs.docker.com/network/' }] },
        { id: 'volumes', title: 'Volumes & Bind Mounts', description: 'Persist data across container restarts', url: 'https://roadmap.sh/docker', resources: [{ label: 'Volumes', url: 'https://docs.docker.com/storage/volumes/' }] },
      ]},
      { id: 'compose', title: 'Docker Compose', topics: [
        { id: 'compose-basics', title: 'Docker Compose', description: 'docker-compose.yml, multi-container apps', url: 'https://roadmap.sh/docker', resources: [{ label: 'Compose', url: 'https://docs.docker.com/compose/' }] },
      ]},
    ]
  },

  sql: {
    id: 'sql',
    title: 'SQL',
    description: 'Master SQL for database management and querying',
    icon: '🗃️',
    url: 'https://roadmap.sh/sql',
    color: '#336791',
    sections: [
      { id: 'basics', title: 'SQL Basics', topics: [
        { id: 'select', title: 'SELECT Queries', description: 'SELECT, FROM, WHERE, ORDER BY, LIMIT', url: 'https://roadmap.sh/sql', resources: [{ label: 'SQL Tutorial', url: 'https://www.w3schools.com/sql/' }] },
        { id: 'filtering', title: 'Filtering & Sorting', description: 'WHERE, AND/OR, IN, BETWEEN, LIKE', url: 'https://roadmap.sh/sql', resources: [{ label: 'WHERE', url: 'https://www.w3schools.com/sql/sql_where.asp' }] },
        { id: 'insert-update-delete', title: 'INSERT, UPDATE, DELETE', description: 'Modify data in tables', url: 'https://roadmap.sh/sql', resources: [{ label: 'SQL DML', url: 'https://www.w3schools.com/sql/sql_insert.asp' }] },
      ]},
      { id: 'joins', title: 'Joins & Relationships', topics: [
        { id: 'inner-join', title: 'INNER JOIN', description: 'Match rows from two tables', url: 'https://roadmap.sh/sql', resources: [{ label: 'INNER JOIN', url: 'https://www.w3schools.com/sql/sql_join_inner.asp' }] },
        { id: 'outer-joins', title: 'LEFT / RIGHT / FULL JOIN', description: 'Include non-matching rows', url: 'https://roadmap.sh/sql', resources: [{ label: 'SQL Joins', url: 'https://www.w3schools.com/sql/sql_join.asp' }] },
        { id: 'subqueries', title: 'Subqueries', description: 'Nested queries and correlated subqueries', url: 'https://roadmap.sh/sql', resources: [{ label: 'Subqueries', url: 'https://www.w3schools.com/sql/sql_subqueries.asp' }] },
      ]},
      { id: 'aggregation', title: 'Aggregation & Grouping', topics: [
        { id: 'aggregate-functions', title: 'Aggregate Functions', description: 'COUNT, SUM, AVG, MIN, MAX', url: 'https://roadmap.sh/sql', resources: [{ label: 'Aggregates', url: 'https://www.w3schools.com/sql/sql_count_avg_sum.asp' }] },
        { id: 'group-by', title: 'GROUP BY & HAVING', description: 'Group results and filter aggregates', url: 'https://roadmap.sh/sql', resources: [{ label: 'GROUP BY', url: 'https://www.w3schools.com/sql/sql_groupby.asp' }] },
        { id: 'window-functions', title: 'Window Functions', description: 'ROW_NUMBER, RANK, LEAD, LAG', url: 'https://roadmap.sh/sql', resources: [{ label: 'Window Functions', url: 'https://www.postgresql.org/docs/current/tutorial-window.html' }] },
      ]},
      { id: 'ddl', title: 'Schema Design', topics: [
        { id: 'create-table', title: 'CREATE TABLE', description: 'Define tables, columns, data types', url: 'https://roadmap.sh/sql', resources: [{ label: 'CREATE TABLE', url: 'https://www.w3schools.com/sql/sql_create_table.asp' }] },
        { id: 'constraints', title: 'Constraints & Indexes', description: 'PRIMARY KEY, FOREIGN KEY, UNIQUE, indexes', url: 'https://roadmap.sh/sql', resources: [{ label: 'Constraints', url: 'https://www.w3schools.com/sql/sql_constraints.asp' }] },
        { id: 'normalization', title: 'Normalization', description: '1NF, 2NF, 3NF, denormalization', url: 'https://roadmap.sh/sql', resources: [{ label: 'Normalization', url: 'https://www.guru99.com/database-normalization.html' }] },
      ]},
    ]
  },

  'git-github': {
    id: 'git-github',
    title: 'Git & GitHub',
    description: 'Version control and collaboration with Git and GitHub',
    icon: '🔀',
    url: 'https://roadmap.sh/git-github',
    color: '#F05032',
    sections: [
      { id: 'basics', title: 'Git Basics', topics: [
        { id: 'init-clone', title: 'init & clone', description: 'Initialize or clone a repository', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Git Basics', url: 'https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository' }] },
        { id: 'add-commit', title: 'add & commit', description: 'Stage and commit changes', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Recording Changes', url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository' }] },
        { id: 'branching', title: 'Branching', description: 'Create, switch, delete branches', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Branching', url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell' }] },
      ]},
      { id: 'collaboration', title: 'Collaboration', topics: [
        { id: 'merge', title: 'Merging', description: 'Merge branches, resolve conflicts', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Merging', url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging' }] },
        { id: 'rebase', title: 'Rebasing', description: 'Reapply commits on top of another branch', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Rebasing', url: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing' }] },
        { id: 'remote', title: 'Remote Repositories', description: 'push, pull, fetch, remote tracking', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Remotes', url: 'https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes' }] },
      ]},
      { id: 'github', title: 'GitHub', topics: [
        { id: 'pull-requests', title: 'Pull Requests', description: 'Create, review, and merge PRs', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Pull Requests', url: 'https://docs.github.com/en/pull-requests' }] },
        { id: 'actions', title: 'GitHub Actions', description: 'CI/CD workflows and automation', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Actions', url: 'https://docs.github.com/en/actions' }] },
      ]},
      { id: 'advanced-git', title: 'Advanced Git', topics: [
        { id: 'stash', title: 'Stashing', description: 'Save and restore work in progress', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Stashing', url: 'https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning' }] },
        { id: 'cherry-pick', title: 'Cherry Pick & Reset', description: 'Apply specific commits, undo changes', url: 'https://roadmap.sh/git-github', resources: [{ label: 'Cherry Pick', url: 'https://git-scm.com/docs/git-cherry-pick' }] },
      ]},
    ]
  },

  'spring-boot': {
    id: 'spring-boot',
    title: 'Spring Boot',
    description: 'Build production-ready Java apps with Spring Boot',
    icon: '🍃',
    url: 'https://roadmap.sh/spring-boot',
    color: '#6DB33F',
    sections: [
      { id: 'fundamentals', title: 'Spring Boot Fundamentals', topics: [
        { id: 'intro', title: 'Introduction', description: 'Auto-configuration, starters, Spring Initializr', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' }] },
        { id: 'dependency-injection', title: 'Dependency Injection', description: '@Autowired, @Component, @Service, @Repository', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'IoC', url: 'https://docs.spring.io/spring-framework/reference/core/beans.html' }] },
        { id: 'configuration', title: 'Configuration', description: 'application.properties, profiles, @Value', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Config', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/features.html' }] },
      ]},
      { id: 'web', title: 'Web Development', topics: [
        { id: 'rest-api', title: 'REST APIs', description: '@RestController, @GetMapping, @PostMapping', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'REST Tutorial', url: 'https://spring.io/guides/tutorials/rest/' }] },
        { id: 'exception-handling', title: 'Exception Handling', description: '@ExceptionHandler, @ControllerAdvice', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Error Handling', url: 'https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc' }] },
      ]},
      { id: 'data', title: 'Data Access', topics: [
        { id: 'spring-data-jpa', title: 'Spring Data JPA', description: 'Repositories, entities, relationships', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Spring Data JPA', url: 'https://spring.io/projects/spring-data-jpa' }] },
        { id: 'transactions', title: 'Transactions', description: '@Transactional, transaction management', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Transactions', url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction.html' }] },
      ]},
      { id: 'security', title: 'Spring Security', topics: [
        { id: 'authentication', title: 'Authentication', description: 'Form login, JWT, OAuth2', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Spring Security', url: 'https://spring.io/projects/spring-security' }] },
        { id: 'authorization', title: 'Authorization', description: 'Roles, authorities, @PreAuthorize', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Authorization', url: 'https://docs.spring.io/spring-security/reference/servlet/authorization/index.html' }] },
      ]},
      { id: 'testing-deploy', title: 'Testing & Deployment', topics: [
        { id: 'testing', title: 'Testing', description: '@SpringBootTest, MockMvc, @MockBean', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Testing', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/features.html' }] },
        { id: 'actuator', title: 'Actuator', description: 'Health checks, metrics, monitoring', url: 'https://roadmap.sh/spring-boot', resources: [{ label: 'Actuator', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html' }] },
      ]},
    ]
  },

  vue: {
    id: 'vue',
    title: 'Vue.js',
    description: 'Build interactive user interfaces with Vue.js',
    icon: '💚',
    url: 'https://roadmap.sh/vue',
    color: '#4FC08D',
    sections: [
      { id: 'fundamentals', title: 'Vue Fundamentals', topics: [
        { id: 'template-syntax', title: 'Template Syntax', description: 'Interpolation, directives, data binding', url: 'https://roadmap.sh/vue', resources: [{ label: 'Template Syntax', url: 'https://vuejs.org/guide/essentials/template-syntax.html' }] },
        { id: 'reactive-data', title: 'Reactive Data', description: 'ref(), reactive(), computed()', url: 'https://roadmap.sh/vue', resources: [{ label: 'Reactivity', url: 'https://vuejs.org/guide/essentials/reactivity-fundamentals.html' }] },
        { id: 'components', title: 'Components', description: 'Single-file components, props, events', url: 'https://roadmap.sh/vue', resources: [{ label: 'Components', url: 'https://vuejs.org/guide/essentials/component-basics.html' }] },
      ]},
      { id: 'directives', title: 'Directives & Features', topics: [
        { id: 'computed-watched', title: 'Computed & Watchers', description: 'computed(), watch(), watchEffect()', url: 'https://roadmap.sh/vue', resources: [{ label: 'Computed', url: 'https://vuejs.org/guide/essentials/computed.html' }] },
        { id: 'conditional-rendering', title: 'Conditional Rendering', description: 'v-if, v-show, v-for', url: 'https://roadmap.sh/vue', resources: [{ label: 'Conditional', url: 'https://vuejs.org/guide/essentials/conditional.html' }] },
        { id: 'form-handling', title: 'Form Handling', description: 'v-model, form validation', url: 'https://roadmap.sh/vue', resources: [{ label: 'Forms', url: 'https://vuejs.org/guide/essentials/forms.html' }] },
      ]},
      { id: 'routing', title: 'Routing & State', topics: [
        { id: 'vue-router', title: 'Vue Router', description: 'Client-side routing for Vue apps', url: 'https://roadmap.sh/vue', resources: [{ label: 'Vue Router', url: 'https://router.vuejs.org/' }] },
        { id: 'pinia', title: 'Pinia State Management', description: 'Modern state management with Pinia', url: 'https://roadmap.sh/vue', resources: [{ label: 'Pinia', url: 'https://pinia.vuejs.org/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'composition-api', title: 'Composition API', description: 'Advanced component logic organization', url: 'https://roadmap.sh/vue', resources: [{ label: 'Composition API', url: 'https://vuejs.org/guide/extras/composition-api-faq.html' }] },
        { id: 'testing', title: 'Testing', description: 'Vi Test, Vitest, unit & e2e testing', url: 'https://roadmap.sh/vue', resources: [{ label: 'Testing Guide', url: 'https://vuejs.org/guide/scaling-up/testing.html' }] },
      ]},
    ]
  },

  angular: {
    id: 'angular',
    title: 'Angular',
    description: 'Build scalable enterprise applications with Angular',
    icon: '🔴',
    url: 'https://roadmap.sh/angular',
    color: '#DD0031',
    sections: [
      { id: 'fundamentals', title: 'Angular Fundamentals', topics: [
        { id: 'components', title: 'Components', description: 'Component structure, decorators, lifecycle hooks', url: 'https://roadmap.sh/angular', resources: [{ label: 'Components', url: 'https://angular.io/guide/component-overview' }] },
        { id: 'templates', title: 'Templates', description: 'Template syntax, property & event binding, directives', url: 'https://roadmap.sh/angular', resources: [{ label: 'Templates', url: 'https://angular.io/guide/template-syntax' }] },
        { id: 'dependency-injection', title: 'Dependency Injection', description: '@Injectable, providers, services', url: 'https://roadmap.sh/angular', resources: [{ label: 'DI', url: 'https://angular.io/guide/dependency-injection' }] },
      ]},
      { id: 'directives-pipes', title: 'Directives & Pipes', topics: [
        { id: 'structural-directives', title: 'Structural Directives', description: '*ngIf, *ngFor, *ngSwitch', url: 'https://roadmap.sh/angular', resources: [{ label: 'Directives', url: 'https://angular.io/guide/structural-directives' }] },
        { id: 'pipes', title: 'Pipes', description: 'Built-in and custom pipes for data transformation', url: 'https://roadmap.sh/angular', resources: [{ label: 'Pipes', url: 'https://angular.io/guide/pipes' }] },
        { id: 'custom-directives', title: 'Custom Directives', description: 'Create reusable element behavior', url: 'https://roadmap.sh/angular', resources: [{ label: 'Custom Directives', url: 'https://angular.io/guide/attribute-directives' }] },
      ]},
      { id: 'forms', title: 'Forms & Validation', topics: [
        { id: 'reactive-forms', title: 'Reactive Forms', description: 'FormBuilder, FormControl, Validators', url: 'https://roadmap.sh/angular', resources: [{ label: 'Reactive Forms', url: 'https://angular.io/guide/reactive-forms' }] },
        { id: 'template-driven-forms', title: 'Template-Driven Forms', description: 'ngModel, form directives', url: 'https://roadmap.sh/angular', resources: [{ label: 'Template Forms', url: 'https://angular.io/guide/forms' }] },
      ]},
      { id: 'routing-http', title: 'Routing & HTTP', topics: [
        { id: 'routing', title: 'Angular Router', description: 'Route guards, lazy loading, nested routes', url: 'https://roadmap.sh/angular', resources: [{ label: 'Routing', url: 'https://angular.io/guide/router' }] },
        { id: 'http', title: 'HTTP Client', description: 'HttpClient, interceptors, error handling', url: 'https://roadmap.sh/angular', resources: [{ label: 'HTTP', url: 'https://angular.io/guide/http' }] },
      ]},
    ]
  },

  css: {
    id: 'css',
    title: 'CSS & Web Design',
    description: 'Master CSS for beautiful and responsive web designs',
    icon: '🎨',
    url: 'https://roadmap.sh/frontend',
    color: '#1572B6',
    sections: [
      { id: 'basics', title: 'CSS Basics', topics: [
        { id: 'selectors', title: 'Selectors', description: 'Element, class, id, attribute selectors, combinators', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Selectors', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors' }] },
        { id: 'box-model', title: 'Box Model', description: 'Margin, padding, border, box-sizing', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Box Model', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' }] },
        { id: 'typography', title: 'Typography', description: 'Font properties, text styles, web fonts', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Typography', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals' }] },
        { id: 'colors', title: 'Colors & Backgrounds', description: 'Color formats, gradients, background images', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Colors', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors' }] },
      ]},
      { id: 'layout', title: 'Layout Systems', topics: [
        { id: 'flexbox', title: 'Flexbox', description: 'Flexible box layout for 1D layouts', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox' }] },
        { id: 'grid', title: 'CSS Grid', description: '2D grid layout, subgrid, template areas', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Grid', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids' }] },
        { id: 'positioning', title: 'Positioning', description: 'Static, relative, absolute, fixed positioning', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Positioning', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning' }] },
      ]},
      { id: 'responsive', title: 'Responsive Design', topics: [
        { id: 'media-queries', title: 'Media Queries', description: 'Breakpoints, mobile-first approach', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Media Queries', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries' }] },
        { id: 'fluid-sizing', title: 'Fluid Sizing', description: 'Responsive units, clamp(), rem/em', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Sizing', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' }] },
      ]},
      { id: 'advanced', title: 'Advanced CSS', topics: [
        { id: 'animations', title: 'Animations & Transitions', description: 'Keyframes, transitions, transform', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations' }] },
        { id: 'variables', title: 'CSS Variables', description: 'Custom properties, --var syntax, inheritance', url: 'https://roadmap.sh/frontend', resources: [{ label: 'CSS Variables', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/--*' }] },
      ]},
    ]
  },

  graphql: {
    id: 'graphql',
    title: 'GraphQL',
    description: 'Query language and runtime for APIs',
    icon: '📡',
    url: 'https://roadmap.sh/graphql',
    color: '#E10098',
    sections: [
      { id: 'intro', title: 'GraphQL Fundamentals', topics: [
        { id: 'what-is-graphql', title: 'What is GraphQL?', description: 'Comparison with REST, benefits, use cases', url: 'https://roadmap.sh/graphql', resources: [{ label: 'GraphQL Guide', url: 'https://graphql.org/learn/' }] },
        { id: 'schema', title: 'Schema & Types', description: 'Type definitions, scalar types, custom types', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Schema', url: 'https://graphql.org/learn/schema/' }] },
        { id: 'queries', title: 'Queries & Mutations', description: 'Query syntax, mutations, subscriptions', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Queries', url: 'https://graphql.org/learn/queries/' }] },
      ]},
      { id: 'server', title: 'Building Servers', topics: [
        { id: 'apollo-server', title: 'Apollo Server', description: 'Build GraphQL APIs with Apollo Server', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Apollo Server', url: 'https://www.apollographql.com/docs/apollo-server/' }] },
        { id: 'resolvers', title: 'Resolvers', description: 'Resolver functions, data fetching logic', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Resolvers', url: 'https://www.apollographql.com/docs/apollo-server/data/resolvers/' }] },
        { id: 'middleware', title: 'Middleware & Plugins', description: 'Request middleware, lifecycle plugins', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Plugins', url: 'https://www.apollographql.com/docs/apollo-server/integrations/plugins/' }] },
      ]},
      { id: 'client', title: 'Client Libraries', topics: [
        { id: 'apollo-client', title: 'Apollo Client', description: 'Caching, state management, optimistic updates', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Apollo Client', url: 'https://www.apollographql.com/docs/react/' }] },
        { id: 'urql', title: 'URQL', description: 'Lightweight GraphQL client library', url: 'https://roadmap.sh/graphql', resources: [{ label: 'URQL', url: 'https://formidable.com/open-source/urql/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'federation', title: 'Apollo Federation', description: 'Compose multiple GraphQL services', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Federation', url: 'https://www.apollographql.com/docs/federation/' }] },
        { id: 'security', title: 'Security & Best Practices', description: 'Rate limiting, authentication, validation', url: 'https://roadmap.sh/graphql', resources: [{ label: 'Best Practices', url: 'https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html' }] },
      ]},
    ]
  },

  kubernetes: {
    id: 'kubernetes',
    title: 'Kubernetes',
    description: 'Container orchestration and deployment at scale',
    icon: '☸️',
    url: 'https://roadmap.sh/kubernetes',
    color: '#326CE5',
    sections: [
      { id: 'basics', title: 'Kubernetes Basics', topics: [
        { id: 'architecture', title: 'Architecture', description: 'Master, nodes, pods, services, namespaces', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Architecture', url: 'https://kubernetes.io/docs/concepts/architecture/' }] },
        { id: 'pods', title: 'Pods', description: 'Smallest deployable units in Kubernetes', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Pods', url: 'https://kubernetes.io/docs/concepts/workloads/pods/' }] },
        { id: 'manifests', title: 'YAML Manifests', description: 'Define Kubernetes resources with YAML', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'YAML', url: 'https://kubernetes.io/docs/concepts/configuration/overview/' }] },
      ]},
      { id: 'workloads', title: 'Workloads & Services', topics: [
        { id: 'deployments', title: 'Deployments', description: 'Manage replicas, rolling updates, rollbacks', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Deployments', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' }] },
        { id: 'services', title: 'Services & Networking', description: 'ClusterIP, NodePort, LoadBalancer, DNS', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Services', url: 'https://kubernetes.io/docs/concepts/services-networking/service/' }] },
        { id: 'statefulsets', title: 'StatefulSets & DaemonSets', description: 'Ordered, backed-up workloads, node daemons', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'StatefulSets', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/' }] },
      ]},
      { id: 'storage', title: 'Storage & Config', topics: [
        { id: 'volumes', title: 'Volumes & Claims', description: 'PersistentVolumes, claims, storage classes', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Storage', url: 'https://kubernetes.io/docs/concepts/storage/' }] },
        { id: 'configmaps-secrets', title: 'ConfigMaps & Secrets', description: 'Configuration management and secrets', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'ConfigMaps', url: 'https://kubernetes.io/docs/concepts/configuration/configmap/' }] },
      ]},
      { id: 'monitoring', title: 'Monitoring & Operations', topics: [
        { id: 'logs-monitoring', title: 'Logging & Monitoring', description: 'ELK stack, Prometheus, debugging pods', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Logging', url: 'https://kubernetes.io/docs/concepts/cluster-administration/logging/' }] },
        { id: 'helm', title: 'Helm Package Manager', description: 'Package and deploy Kubernetes apps', url: 'https://roadmap.sh/kubernetes', resources: [{ label: 'Helm', url: 'https://helm.sh/docs/' }] },
      ]},
    ]
  },

  aws: {
    id: 'aws',
    title: 'AWS (Amazon Web Services)',
    description: 'Cloud infrastructure and services on AWS',
    icon: '☁️',
    url: 'https://roadmap.sh/aws',
    color: '#FF9900',
    sections: [
      { id: 'fundamentals', title: 'AWS Fundamentals', topics: [
        { id: 'regions-azs', title: 'Regions & Availability Zones', description: 'Global infrastructure, disaster recovery', url: 'https://roadmap.sh/aws', resources: [{ label: 'Infrastructure', url: 'https://aws.amazon.com/about-aws/global-infrastructure/' }] },
        { id: 'iam', title: 'IAM (Identity & Access)', description: 'Users, roles, policies, permissions', url: 'https://roadmap.sh/aws', resources: [{ label: 'IAM', url: 'https://docs.aws.amazon.com/iam/' }] },
        { id: 'billing', title: 'Billing & Cost Management', description: 'Cost optimization, budgets, estimator', url: 'https://roadmap.sh/aws', resources: [{ label: 'Billing', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/' }] },
      ]},
      { id: 'compute', title: 'Compute Services', topics: [
        { id: 'ec2', title: 'EC2 (Elastic Compute)', description: 'Virtual machines, instances, security groups', url: 'https://roadmap.sh/aws', resources: [{ label: 'EC2', url: 'https://docs.aws.amazon.com/ec2/' }] },
        { id: 'lambda', title: 'Lambda (Serverless)', description: 'Event-driven functions, Lambda@Edge', url: 'https://roadmap.sh/aws', resources: [{ label: 'Lambda', url: 'https://docs.aws.amazon.com/lambda/' }] },
        { id: 'ecs-ekt', title: 'ECS & EKS (Containers)', description: 'Docker containers, Kubernetes on AWS', url: 'https://roadmap.sh/aws', resources: [{ label: 'ECS', url: 'https://docs.aws.amazon.com/ecs/' }] },
      ]},
      { id: 'storage-db', title: 'Storage & Databases', topics: [
        { id: 's3', title: 'S3 (Object Storage)', description: 'Buckets, objects, access control, CloudFront', url: 'https://roadmap.sh/aws', resources: [{ label: 'S3', url: 'https://docs.aws.amazon.com/s3/' }] },
        { id: 'rds', title: 'RDS (Relational DB)', description: 'Managed SQL databases, backups, replication', url: 'https://roadmap.sh/aws', resources: [{ label: 'RDS', url: 'https://docs.aws.amazon.com/rds/' }] },
        { id: 'dynamodb', title: 'DynamoDB (NoSQL)', description: 'Fast NoSQL database, global tables', url: 'https://roadmap.sh/aws', resources: [{ label: 'DynamoDB', url: 'https://docs.aws.amazon.com/dynamodb/' }] },
      ]},
      { id: 'networking', title: 'Networking & CDN', topics: [
        { id: 'vpc', title: 'VPC (Virtual Network)', description: 'Subnets, route tables, NAT gateways', url: 'https://roadmap.sh/aws', resources: [{ label: 'VPC', url: 'https://docs.aws.amazon.com/vpc/' }] },
        { id: 'elb', title: 'Load Balancing', description: 'ELB, ALB, NLB distribution and scaling', url: 'https://roadmap.sh/aws', resources: [{ label: 'ELB', url: 'https://docs.aws.amazon.com/elasticloadbalancing/' }] },
      ]},
    ]
  },

  go: {
    id: 'go',
    title: 'Go (Golang)',
    description: 'Build fast, efficient backend systems with Go',
    icon: '🐹',
    url: 'https://roadmap.sh/golang',
    color: '#00ADD8',
    sections: [
      { id: 'basics', title: 'Go Basics', topics: [
        { id: 'syntax', title: 'Syntax & Fundamentals', description: 'Variables, types, functions, control flow', url: 'https://roadmap.sh/golang', resources: [{ label: 'Tour of Go', url: 'https://go.dev/tour/' }] },
        { id: 'packages', title: 'Packages & Modules', description: 'Import, export, go.mod, module dependencies', url: 'https://roadmap.sh/golang', resources: [{ label: 'Packages', url: 'https://go.dev/doc/effective_go#packages' }] },
        { id: 'error-handling', title: 'Error Handling', description: 'Error interface, custom errors, error wrapping', url: 'https://roadmap.sh/golang', resources: [{ label: 'Errors', url: 'https://go.dev/blog/error-handling-and-go' }] },
      ]},
      { id: 'oop', title: 'Object-Oriented Programming', topics: [
        { id: 'structs-methods', title: 'Structs & Methods', description: 'Define types, receiver methods, embedded types', url: 'https://roadmap.sh/golang', resources: [{ label: 'Methods', url: 'https://go.dev/tour/methods/1' }] },
        { id: 'interfaces', title: 'Interfaces', description: 'Interface definitions, type assertions, polymorphism', url: 'https://roadmap.sh/golang', resources: [{ label: 'Interfaces', url: 'https://go.dev/tour/methods/9' }] },
        { id: 'concurrency', title: 'Concurrency', description: 'Goroutines, channels, select, sync primitives', url: 'https://roadmap.sh/golang', resources: [{ label: 'Concurrency', url: 'https://go.dev/tour/concurrency/1' }] },
      ]},
      { id: 'web', title: 'Web Development', topics: [
        { id: 'http', title: 'HTTP & Web Servers', description: 'net/http package, handlers, routers', url: 'https://roadmap.sh/golang', resources: [{ label: 'HTTP', url: 'https://pkg.go.dev/net/http' }] },
        { id: 'frameworks', title: 'Go Web Frameworks', description: 'Gin, Echo, Fiber, Chi router', url: 'https://roadmap.sh/golang', resources: [{ label: 'Gin', url: 'https://gin-gonic.com/' }] },
        { id: 'databases', title: 'Database Access', description: 'database/sql, ORMs like GORM', url: 'https://roadmap.sh/golang', resources: [{ label: 'GORM', url: 'https://gorm.io/' }] },
      ]},
      { id: 'tooling', title: 'Testing & Tooling', topics: [
        { id: 'testing', title: 'Testing', description: '*_test.go files, table-driven tests, mocking', url: 'https://roadmap.sh/golang', resources: [{ label: 'Testing', url: 'https://pkg.go.dev/testing' }] },
        { id: 'packaging', title: 'Packaging & Deployment', description: 'Cross-compilation, Docker, executables', url: 'https://roadmap.sh/golang', resources: [{ label: 'Building', url: 'https://go.dev/doc/effective_go#building' }] },
      ]},
    ]
  },

  mongodb: {
    id: 'mongodb',
    title: 'MongoDB',
    description: 'NoSQL database for flexible document storage',
    icon: '🍃',
    url: 'https://roadmap.sh/mongodb',
    color: '#13AA52',
    sections: [
      { id: 'basics', title: 'MongoDB Basics', topics: [
        { id: 'databases-collections', title: 'Databases & Collections', description: 'Database structure, BSON documents', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Intro', url: 'https://docs.mongodb.com/manual/introduction/' }] },
        { id: 'crud-operations', title: 'CRUD Operations', description: 'Create, read, update, delete documents', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'CRUD', url: 'https://docs.mongodb.com/manual/crud/' }] },
        { id: 'document-structure', title: 'Document Structure', description: 'Schemas, validation, nested documents', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Schemas', url: 'https://docs.mongodb.com/manual/core/schema-validation/' }] },
      ]},
      { id: 'querying', title: 'Querying & Filtering', topics: [
        { id: 'query-operators', title: 'Query Operators', description: '$eq, $gt, $in, $regex, array queries', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Query Operators', url: 'https://docs.mongodb.com/manual/reference/operator/query/' }] },
        { id: 'aggregation', title: 'Aggregation Pipeline', description: '$match, $group, $project, $lookup stages', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Aggregation', url: 'https://docs.mongodb.com/manual/aggregation/' }] },
        { id: 'indexing', title: 'Indexing', description: 'Create indexes, query performance, index types', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Indexes', url: 'https://docs.mongodb.com/manual/indexes/' }] },
      ]},
      { id: 'design', title: 'Data Design & Relationships', topics: [
        { id: 'relationships', title: 'Relationships', description: 'Embedding vs referencing documents', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Relationships', url: 'https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/' }] },
        { id: 'transactions', title: 'Transactions', description: 'ACID transactions, session handling', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Transactions', url: 'https://docs.mongodb.com/manual/core/transactions/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'replication', title: 'Replication & Sharding', description: 'Replica sets, sharded clusters, backup', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Replication', url: 'https://docs.mongodb.com/manual/replication/' }] },
        { id: 'drivers', title: 'Drivers & ORMs', description: 'MongoDB drivers for Node.js, Python, Java, Mongoose', url: 'https://roadmap.sh/mongodb', resources: [{ label: 'Drivers', url: 'https://docs.mongodb.com/drivers/' }] },
      ]},
    ]
  },

  rust: {
    id: 'rust',
    title: 'Rust',
    description: 'Systems programming language with memory safety',
    icon: '🦀',
    url: 'https://roadmap.sh/rust',
    color: '#CE422B',
    sections: [
      { id: 'fundamentals', title: 'Rust Fundamentals', topics: [
        { id: 'syntax-basics', title: 'Syntax & Basics', description: 'Variables, data types, operators, control flow', url: 'https://roadmap.sh/rust', resources: [{ label: 'The Book', url: 'https://doc.rust-lang.org/book/' }] },
        { id: 'ownership', title: 'Ownership & Borrowing', description: 'Ownership rules, borrowing, references, lifetimes', url: 'https://roadmap.sh/rust', resources: [{ label: 'Ownership', url: 'https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html' }] },
        { id: 'structs-enums', title: 'Structs & Enums', description: 'Define custom types, pattern matching', url: 'https://roadmap.sh/rust', resources: [{ label: 'Structs', url: 'https://doc.rust-lang.org/book/ch05-00-structs.html' }] },
      ]},
      { id: 'advanced', title: 'Advanced Concepts', topics: [
        { id: 'traits', title: 'Traits', description: 'Define shared behavior, trait objects, generics', url: 'https://roadmap.sh/rust', resources: [{ label: 'Traits', url: 'https://doc.rust-lang.org/book/ch10-02-traits.html' }] },
        { id: 'error-handling', title: 'Error Handling', description: 'Result, Option, custom error types', url: 'https://roadmap.sh/rust', resources: [{ label: 'Errors', url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html' }] },
        { id: 'concurrency', title: 'Concurrency', description: 'Threads, message passing, Arc, Mutex', url: 'https://roadmap.sh/rust', resources: [{ label: 'Concurrency', url: 'https://doc.rust-lang.org/book/ch16-00-concurrency.html' }] },
      ]},
      { id: 'ecosystem', title: 'Rust Ecosystem', topics: [
        { id: 'web-frameworks', title: 'Web Frameworks', description: 'Axum, Tokio, Actix-web, Rocket', url: 'https://roadmap.sh/rust', resources: [{ label: 'Tokio', url: 'https://tokio.rs/' }] },
        { id: 'testing', title: 'Testing & Documentation', description: 'Unit tests, integration tests, doc comments', url: 'https://roadmap.sh/rust', resources: [{ label: 'Testing', url: 'https://doc.rust-lang.org/book/ch11-00-testing.html' }] },
        { id: 'cargo', title: 'Cargo & Package Management', description: 'Build system, dependencies, publishing', url: 'https://roadmap.sh/rust', resources: [{ label: 'Cargo', url: 'https://doc.rust-lang.org/cargo/' }] },
      ]},
    ]
  },

  frontend: {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Complete guide to becoming a modern frontend developer',
    icon: '🎨',
    url: 'https://roadmap.sh/frontend',
    color: '#F7DF1E',
    sections: [
      { id: 'html-css-js', title: 'HTML, CSS & JavaScript', topics: [
        { id: 'html-basics', title: 'HTML Basics', description: 'Semantic HTML, forms, accessibility, meta tags', url: 'https://roadmap.sh/frontend', resources: [{ label: 'HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }] },
        { id: 'css-styling', title: 'CSS & Styling', description: 'Flexbox, Grid, responsive design, animations', url: 'https://roadmap.sh/frontend', resources: [{ label: 'CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' }] },
        { id: 'js-programming', title: 'JavaScript Essentials', description: 'Core concepts, DOM, events, async programming', url: 'https://roadmap.sh/frontend', resources: [{ label: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' }] },
      ]},
      { id: 'frameworks', title: 'Frontend Frameworks', topics: [
        { id: 'react-vue-angular', title: 'React, Vue, Angular', description: 'Component-based frameworks, state management, routing', url: 'https://roadmap.sh/frontend', resources: [{ label: 'React', url: 'https://react.dev' }] },
        { id: 'meta-frameworks', title: 'Meta Frameworks', description: 'Next.js, Nuxt, etc. for SSR and full-stack apps', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Next.js', url: 'https://nextjs.org' }] },
      ]},
      { id: 'tools', title: 'Build Tools & Testing', topics: [
        { id: 'bundlers', title: 'Bundlers', description: 'Webpack, Vite, Parcel', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Vite', url: 'https://vitejs.dev' }] },
        { id: 'testing', title: 'Testing', description: 'Jest, Vitest, React Testing Library', url: 'https://roadmap.sh/frontend', resources: [{ label: 'Testing', url: 'https://testing-library.com' }] },
      ]},
    ]
  },

  backend: {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Complete guide to becoming a backend developer',
    icon: '⚙️',
    url: 'https://roadmap.sh/backend',
    color: '#4CAF50',
    sections: [
      { id: 'fundamentals', title: 'Backend Fundamentals', topics: [
        { id: 'web-basics', title: 'Web Protocol Basics', description: 'HTTP/HTTPS, REST, APIs, DNS', url: 'https://roadmap.sh/backend', resources: [{ label: 'HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' }] },
        { id: 'databases', title: 'Databases', description: 'SQL, NoSQL, indexes, queries, transactions', url: 'https://roadmap.sh/backend', resources: [{ label: 'Databases', url: 'https://en.wikipedia.org/wiki/Database' }] },
        { id: 'security', title: 'Security Basics', description: 'Authentication, authorization, encryption, CORS', url: 'https://roadmap.sh/backend', resources: [{ label: 'Security', url: 'https://owasp.org' }] },
      ]},
      { id: 'languages', title: 'Backend Languages', topics: [
        { id: 'languages', title: 'Popular Languages', description: 'Python, Node.js, Java, Go, PHP, Ruby', url: 'https://roadmap.sh/backend', resources: [{ label: 'Languages', url: 'https://roadmap.sh/backend' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'caching', title: 'Caching', description: 'Redis, memcached, HTTP caching strategies', url: 'https://roadmap.sh/backend', resources: [{ label: 'Redis', url: 'https://redis.io' }] },
        { id: 'deployment', title: 'Deployment', description: 'Docker, CI/CD, cloud platforms, monitoring', url: 'https://roadmap.sh/backend', resources: [{ label: 'Docker', url: 'https://docker.com' }] },
      ]},
    ]
  },

  fullstack: {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend development',
    icon: '🔄',
    url: 'https://roadmap.sh/full-stack',
    color: '#2196F3',
    sections: [
      { id: 'frontend-stack', title: 'Frontend Stack', topics: [
        { id: 'react-next', title: 'React & Next.js', description: 'Modern React applications with server-side rendering', url: 'https://roadmap.sh/full-stack', resources: [{ label: 'Next.js', url: 'https://nextjs.org' }] },
        { id: 'css-framework', title: 'Styling Framework', description: 'Tailwind CSS, styled-components', url: 'https://roadmap.sh/full-stack', resources: [{ label: 'Tailwind', url: 'https://tailwindcss.com' }] },
      ]},
      { id: 'backend-stack', title: 'Backend Stack', topics: [
        { id: 'api-framework', title: 'API Framework', description: 'Express, FastAPI, Spring Boot, Django', url: 'https://roadmap.sh/full-stack', resources: [{ label: 'Node.js', url: 'https://nodejs.org' }] },
        { id: 'database', title: 'Database', description: 'PostgreSQL, MongoDB for full-stack apps', url: 'https://roadmap.sh/full-stack', resources: [{ label: 'PostgreSQL', url: 'https://postgresql.org' }] },
      ]},
      { id: 'devops', title: 'DevOps & Deployment', topics: [
        { id: 'docker-k8s', title: 'Docker & Kubernetes', description: 'Containerization and orchestration', url: 'https://roadmap.sh/full-stack', resources: [{ label: 'Docker', url: 'https://docker.com' }] },
      ]},
    ]
  },

  devops: {
    id: 'devops',
    title: 'DevOps Specialist',
    description: 'Infrastructure automation and deployment excellence',
    icon: '🚀',
    url: 'https://roadmap.sh/devops',
    color: '#FF6B6B',
    sections: [
      { id: 'fundamentals', title: 'DevOps Fundamentals', topics: [
        { id: 'linux-basics', title: 'Linux Fundamentals', description: 'Command line, file systems, permissions, processes', url: 'https://roadmap.sh/devops', resources: [{ label: 'Linux', url: 'https://linux.org' }] },
        { id: 'networking', title: 'Networking Basics', description: 'TCP/IP, DNS, firewalls, VPN', url: 'https://roadmap.sh/devops', resources: [{ label: 'Networking', url: 'https://en.wikipedia.org/wiki/Computer_network' }] },
      ]},
      { id: 'containerization', title: 'Containerization', topics: [
        { id: 'docker', title: 'Docker', description: 'Images, containers, compose, registries', url: 'https://roadmap.sh/devops', resources: [{ label: 'Docker', url: 'https://docker.com' }] },
        { id: 'kubernetes', title: 'Kubernetes', description: 'Orchestration, deployments, services, helm', url: 'https://roadmap.sh/devops', resources: [{ label: 'Kubernetes', url: 'https://kubernetes.io' }] },
      ]},
      { id: 'iac', title: 'Infrastructure as Code', topics: [
        { id: 'terraform', title: 'Terraform', description: 'Create and manage cloud infrastructure', url: 'https://roadmap.sh/devops', resources: [{ label: 'Terraform', url: 'https://www.terraform.io' }] },
        { id: 'ansible', title: 'Configuration Management', description: 'Ansible, Chef, Puppet automation', url: 'https://roadmap.sh/devops', resources: [{ label: 'Ansible', url: 'https://www.ansible.com' }] },
      ]},
      { id: 'cicd', title: 'CI/CD & Monitoring', topics: [
        { id: 'cicd-tools', title: 'CI/CD Tools', description: 'GitHub Actions, GitLab CI, Jenkins', url: 'https://roadmap.sh/devops', resources: [{ label: 'GitHub Actions', url: 'https://github.com/features/actions' }] },
        { id: 'monitoring', title: 'Monitoring & Logging', description: 'Prometheus, ELK, Grafana, Datadog', url: 'https://roadmap.sh/devops', resources: [{ label: 'Prometheus', url: 'https://prometheus.io' }] },
      ]},
    ]
  },

  devsecops: {
    id: 'devsecops',
    title: 'DevSecOps Specialist',
    description: 'Security integrated throughout development pipeline',
    icon: '🔒',
    url: 'https://roadmap.sh/devsecops',
    color: '#E91E63',
    sections: [
      { id: 'fundamentals', title: 'Security Fundamentals', topics: [
        { id: 'principles', title: 'Security Principles', description: 'Confidentiality, integrity, availability, defense in depth', url: 'https://roadmap.sh/devsecops', resources: [{ label: 'OWASP', url: 'https://owasp.org' }] },
        { id: 'cryptography', title: 'Cryptography', description: 'Encryption, hashing, digital signatures', url: 'https://roadmap.sh/devsecops', resources: [{ label: 'Crypto', url: 'https://en.wikipedia.org/wiki/Cryptography' }] },
      ]},
      { id: 'secure-development', title: 'Secure Development', topics: [
        { id: 'sast', title: 'SAST / Code Analysis', description: 'Static analysis, linting, code scanning tools', url: 'https://roadmap.sh/devsecops', resources: [{ label: 'SonarQube', url: 'https://www.sonarqube.org' }] },
        { id: 'owasp', title: 'OWASP Top 10', description: 'Common vulnerabilities and prevention', url: 'https://roadmap.sh/devsecops', resources: [{ label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' }] },
      ]},
      { id: 'ci-security', title: 'Secure CI/CD', topics: [
        { id: 'secrets', title: 'Secrets Management', description: 'Vault, sealed secrets, environment variables', url: 'https://roadmap.sh/devsecops', resources: [{ label: 'Vault', url: 'https://www.vaultproject.io' }] },
        { id: 'scanning', title: 'Vulnerability Scanning', description: 'DAST, dependency checks, container scanning', url: 'https://roadmap.sh/devsecops', resources: [{ label: 'Snyk', url: 'https://snyk.io' }] },
      ]},
    ]
  },

  dataanalyst: {
    id: 'dataanalyst',
    title: 'Data Analyst',
    description: 'Transform data into actionable insights',
    icon: '📊',
    url: 'https://roadmap.sh/data-analyst',
    color: '#FF9800',
    sections: [
      { id: 'foundations', title: 'Data Foundations', topics: [
        { id: 'statistics', title: 'Statistics', description: 'Descriptive, inferential, probability', url: 'https://roadmap.sh/data-analyst', resources: [{ label: 'Statistics', url: 'https://en.wikipedia.org/wiki/Statistics' }] },
        { id: 'databases', title: 'SQL & Databases', description: 'Query, join, aggregate, optimize', url: 'https://roadmap.sh/data-analyst', resources: [{ label: 'SQL', url: 'https://www.w3schools.com/sql/' }] },
      ]},
      { id: 'tools', title: 'Data Tools', topics: [
        { id: 'excel-python', title: 'Excel & Python', description: 'Data manipulation with pandas, NumPy', url: 'https://roadmap.sh/data-analyst', resources: [{ label: 'Pandas', url: 'https://pandas.pydata.org' }] },
        { id: 'visualization', title: 'Data Visualization', description: 'Tableau, Power BI, matplotlib, plotly', url: 'https://roadmap.sh/data-analyst', resources: [{ label: 'Tableau', url: 'https://www.tableau.com' }] },
      ]},
      { id: 'analytics', title: 'Analytics & Reporting', topics: [
        { id: 'dashboards', title: 'Dashboards & Reports', description: 'KPIs, metrics, storytelling with data', url: 'https://roadmap.sh/data-analyst', resources: [{ label: 'Power BI', url: 'https://powerbi.microsoft.com' }] },
      ]},
    ]
  },

  aiEngineer: {
    id: 'aiEngineer',
    title: 'AI Engineer',
    description: 'Build and deploy artificial intelligence systems',
    icon: '🤖',
    url: 'https://roadmap.sh/ai-engineer',
    color: '#9C27B0',
    sections: [
      { id: 'fundamentals', title: 'AI Fundamentals', topics: [
        { id: 'math', title: 'Mathematics', description: 'Linear algebra, calculus, probability for ML', url: 'https://roadmap.sh/ai-engineer', resources: [{ label: 'Math', url: 'https://en.wikipedia.org/wiki/Mathematics' }] },
        { id: 'ml-basics', title: 'Machine Learning Basics', description: 'Supervised, unsupervised, reinforcement learning', url: 'https://roadmap.sh/ai-engineer', resources: [{ label: 'ML', url: 'https://en.wikipedia.org/wiki/Machine_learning' }] },
      ]},
      { id: 'deep-learning', title: 'Deep Learning', topics: [
        { id: 'neural-networks', title: 'Neural Networks', description: 'CNNs, RNNs, Transformers, attention mechanisms', url: 'https://roadmap.sh/ai-engineer', resources: [{ label: 'TensorFlow', url: 'https://tensorflow.org' }] },
        { id: 'llms', title: 'Large Language Models', description: 'Fine-tuning, prompt engineering, RAG', url: 'https://roadmap.sh/ai-engineer', resources: [{ label: 'OpenAI', url: 'https://openai.com' }] },
      ]},
      { id: 'deployment', title: 'Deployment & Tools', topics: [
        { id: 'frameworks', title: 'ML Frameworks', description: 'TensorFlow, PyTorch, scikit-learn, Hugging Face', url: 'https://roadmap.sh/ai-engineer', resources: [{ label: 'PyTorch', url: 'https://pytorch.org' }] },
        { id: 'mlops', title: 'MLOps', description: 'Model serving, monitoring, versioning', url: 'https://roadmap.sh/ai-engineer', resources: [{ label: 'MLflow', url: 'https://mlflow.org' }] },
      ]},
    ]
  },

  dataengineer: {
    id: 'dataengineer',
    title: 'Data Engineer',
    description: 'Build scalable data infrastructure and pipelines',
    icon: '🏗️',
    url: 'https://roadmap.sh/data-engineer',
    color: '#4CAF50',
    sections: [
      { id: 'fundamentals', title: 'Data Fundamentals', topics: [
        { id: 'databases', title: 'SQL & Database Design', description: 'Normalization, optimization, indexing', url: 'https://roadmap.sh/data-engineer', resources: [{ label: 'PostgreSQL', url: 'https://postgresql.org' }] },
        { id: 'data-concepts', title: 'Data Concepts', description: 'ETL, ELT, data modeling, metadata', url: 'https://roadmap.sh/data-engineer', resources: [{ label: 'Data', url: 'https://en.wikipedia.org/wiki/Data_engineering' }] },
      ]},
      { id: 'big-data', title: 'Big Data Technologies', topics: [
        { id: 'hadoop-spark', title: 'Hadoop & Spark', description: 'Distributed processing, MapReduce, Spark SQL', url: 'https://roadmap.sh/data-engineer', resources: [{ label: 'Spark', url: 'https://spark.apache.org' }] },
        { id: 'pipelines', title: 'Data Pipelines', description: 'Apache Airflow, Kafka, streaming, batch processing', url: 'https://roadmap.sh/data-engineer', resources: [{ label: 'Airflow', url: 'https://airflow.apache.org' }] },
      ]},
      { id: 'cloud', title: 'Cloud Data Platforms', topics: [
        { id: 'cloud-dw', title: 'Data Warehouses', description: 'Snowflake, BigQuery, Redshift', url: 'https://roadmap.sh/data-engineer', resources: [{ label: 'Snowflake', url: 'https://www.snowflake.com' }] },
      ]},
    ]
  },

  android: {
    id: 'android',
    title: 'Android Developer',
    description: 'Build native Android applications',
    icon: '🤖',
    url: 'https://roadmap.sh/android',
    color: '#3DDC84',
    sections: [
      { id: 'fundamentals', title: 'Android Fundamentals', topics: [
        { id: 'kotlin', title: 'Kotlin Programming', description: 'Language syntax, null safety, extension functions', url: 'https://roadmap.sh/android', resources: [{ label: 'Kotlin', url: 'https://kotlinlang.org' }] },
        { id: 'components', title: 'Android Components', description: 'Activities, fragments, services, broadcast receivers', url: 'https://roadmap.sh/android', resources: [{ label: 'Android Docs', url: 'https://developer.android.com' }] },
      ]},
      { id: 'ui', title: 'UI Development', topics: [
        { id: 'xml-layouts', title: 'XML & Layouts', description: 'Layout files, views, constraints', url: 'https://roadmap.sh/android', resources: [{ label: 'Layouts', url: 'https://developer.android.com/guide/topics/ui/declaring-layout' }] },
        { id: 'compose', title: 'Jetpack Compose', description: 'Modern declarative UI toolkit', url: 'https://roadmap.sh/android', resources: [{ label: 'Compose', url: 'https://developer.android.com/jetpack/compose' }] },
      ]},
      { id: 'architecture', title: 'Architecture & Data', topics: [
        { id: 'MVVM', title: 'Architecture Patterns', description: 'MVVM, MVC, MVP patterns', url: 'https://roadmap.sh/android', resources: [{ label: 'MVVM', url: 'https://developer.android.com/topic/libraries/architecture/viewmodel' }] },
        { id: 'networking', title: 'Networking & Storage', description: 'Retrofit, Room, SharedPreferences, databases', url: 'https://roadmap.sh/android', resources: [{ label: 'Retrofit', url: 'https://square.github.io/retrofit/' }] },
      ]},
    ]
  },

  ios: {
    id: 'ios',
    title: 'iOS Developer',
    description: 'Build native iOS applications with Swift',
    icon: '📱',
    url: 'https://roadmap.sh/ios',
    color: '#000000',
    sections: [
      { id: 'fundamentals', title: 'iOS Fundamentals', topics: [
        { id: 'swift', title: 'Swift Programming', description: 'Syntax, optionals, protocols, generics', url: 'https://roadmap.sh/ios', resources: [{ label: 'Swift', url: 'https://swift.org/documentation/' }] },
        { id: 'uikit', title: 'UIKit & SwiftUI', description: 'Traditional UIKit and modern SwiftUI frameworks', url: 'https://roadmap.sh/ios', resources: [{ label: 'SwiftUI', url: 'https://developer.apple.com/xcode/swiftui/' }] },
      ]},
      { id: 'frameworks', title: 'Core Frameworks', topics: [
        { id: 'foundation', title: 'Foundation Framework', description: 'Data types, collections, networking', url: 'https://roadmap.sh/ios', resources: [{ label: 'Foundation', url: 'https://developer.apple.com/foundation/' }] },
        { id: 'core-data', title: 'Core Data & Storage', description: 'Local database, file management', url: 'https://roadmap.sh/ios', resources: [{ label: 'Core Data', url: 'https://developer.apple.com/core-data/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'concurrency', title: 'Concurrency & Async', description: 'Async/await, combine, multithreading', url: 'https://roadmap.sh/ios', resources: [{ label: 'Concurrency', url: 'https://developer.apple.com/documentation/swift/concurrency' }] },
        { id: 'testing', title: 'Testing & Distribution', description: 'Unit tests, UI tests, app store deployment', url: 'https://roadmap.sh/ios', resources: [{ label: 'Testing', url: 'https://developer.apple.com/xcode/testing/' }] },
      ]},
    ]
  },

  nextjs: {
    id: 'nextjs',
    title: 'Next.js',
    description: 'Modern full-stack React framework',
    icon: '▲',
    url: 'https://nextjs.org',
    color: '#000000',
    sections: [
      { id: 'fundamentals', title: 'Next.js Fundamentals', topics: [
        { id: 'pages-routing', title: 'Pages & Routing', description: 'App router, file-based routing, dynamic routes', url: 'https://nextjs.org', resources: [{ label: 'Routing', url: 'https://nextjs.org/docs/app/building-your-application/routing' }] },
        { id: 'rendering', title: 'Rendering Modes', description: 'SSR, SSG, ISR, CSR', url: 'https://nextjs.org', resources: [{ label: 'Rendering', url: 'https://nextjs.org/docs/app/building-your-application/rendering' }] },
      ]},
      { id: 'features', title: 'Key Features', topics: [
        { id: 'api-routes', title: 'API Routes', description: 'Build backend functionality with API routes', url: 'https://nextjs.org', resources: [{ label: 'API Routes', url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers' }] },
        { id: 'image-optimization', title: 'Optimization', description: 'Image, font, script optimization', url: 'https://nextjs.org', resources: [{ label: 'Optimization', url: 'https://nextjs.org/docs/app/building-your-application/optimizing' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'data-fetching', title: 'Data Fetching', description: 'Fetch, caching, revalidation, mutations', url: 'https://nextjs.org', resources: [{ label: 'Data Fetching', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching' }] },
        { id: 'deployment', title: 'Deployment', description: 'Vercel, self-hosting, edge functions', url: 'https://nextjs.org', resources: [{ label: 'Deployment', url: 'https://nextjs.org/docs/app/building-your-application/deploying' }] },
      ]},
    ]
  },

  systemdesign: {
    id: 'systemdesign',
    title: 'System Design',
    description: 'Design scalable and distributed systems',
    icon: '🏛️',
    url: 'https://roadmap.sh/system-design',
    color: '#1E90FF',
    sections: [
      { id: 'fundamentals', title: 'Fundamentals', topics: [
        { id: 'scalability', title: 'Scalability Concepts', description: 'Horizontal vs vertical scaling, load balancing', url: 'https://roadmap.sh/system-design', resources: [{ label: 'Scalability', url: 'https://en.wikipedia.org/wiki/Scalability' }] },
        { id: 'database-design', title: 'Database Design', description: 'Partitioning, sharding, replication', url: 'https://roadmap.sh/system-design', resources: [{ label: 'Database Design', url: 'https://en.wikipedia.org/wiki/Database_design' }] },
      ]},
      { id: 'architecture', title: 'Architecture Patterns', topics: [
        { id: 'microservices', title: 'Microservices', description: 'Service decomposition, communication patterns', url: 'https://roadmap.sh/system-design', resources: [{ label: 'Microservices', url: 'https://microservices.io' }] },
        { id: 'caching', title: 'Caching Strategies', description: 'CDN, cache invalidation, cache coherence', url: 'https://roadmap.sh/system-design', resources: [{ label: 'Caching', url: 'https://en.wikipedia.org/wiki/Cache_(computing)' }] },
      ]},
      { id: 'distributed', title: 'Distributed Systems', topics: [
        { id: 'consensus', title: 'Consensus Algorithms', description: 'RAFT, Paxos, eventual consistency', url: 'https://roadmap.sh/system-design', resources: [{ label: 'Consensus', url: 'https://en.wikipedia.org/wiki/Consensus_(computer_science)' }] },
        { id: 'monitoring', title: 'Monitoring & Reliability', description: 'Logging, metrics, alerting, SLOs', url: 'https://roadmap.sh/system-design', resources: [{ label: 'Monitoring', url: 'https://en.wikipedia.org/wiki/Systems_management' }] },
      ]},
    ]
  },

  postgresql: {
    id: 'postgresql',
    title: 'PostgreSQL',
    description: 'Advanced relational database system',
    icon: '🐘',
    url: 'https://postgresql.org',
    color: '#336791',
    sections: [
      { id: 'basics', title: 'PostgreSQL Basics', topics: [
        { id: 'installation', title: 'Installation & Setup', description: 'Installation, configuration, psql client', url: 'https://postgresql.org', resources: [{ label: 'Docs', url: 'https://postgresql.org/docs' }] },
        { id: 'sql', title: 'SQL Essentials', description: 'Tables, data types, constraints, CRUD', url: 'https://postgresql.org', resources: [{ label: 'SQL', url: 'https://postgresql.org/docs/current/sql.html' }] },
      ]},
      { id: 'advanced', title: 'Advanced Features', topics: [
        { id: 'transactions', title: 'Transactions & ACID', description: 'ACID properties, isolation levels, locks', url: 'https://postgresql.org', resources: [{ label: 'Transactions', url: 'https://postgresql.org/docs/current/tutorial-transactions.html' }] },
        { id: 'jsonb', title: 'JSONB & Extensions', description: 'JSON support, PostGIS, full-text search', url: 'https://postgresql.org', resources: [{ label: 'JSONB', url: 'https://postgresql.org/docs/current/datatype-json.html' }] },
        { id: 'performance', title: 'Performance Tuning', description: 'Indexing, query optimization, vacuuming', url: 'https://postgresql.org', resources: [{ label: 'Performance', url: 'https://postgresql.org/docs/current/performance-tips.html' }] },
      ]},
      { id: 'administration', title: 'Administration', topics: [
        { id: 'backup', title: 'Backup & Replication', description: 'Backup strategies, binary replication, logical replication', url: 'https://postgresql.org', resources: [{ label: 'Backup', url: 'https://postgresql.org/docs/current/backup.html' }] },
      ]},
    ]
  },

  linux: {
    id: 'linux',
    title: 'Linux',
    description: 'Master Linux operating system and command line',
    icon: '🐧',
    url: 'https://linux.org',
    color: '#FCC624',
    sections: [
      { id: 'basics', title: 'Linux Basics', topics: [
        { id: 'installation', title: 'Installation & Setup', description: 'Distributions, partitioning, bootloader', url: 'https://linux.org', resources: [{ label: 'Linux', url: 'https://linux.org' }] },
        { id: 'filesystem', title: 'File System', description: 'Directory structure, permissions, inodes', url: 'https://linux.org', resources: [{ label: 'File System', url: 'https://en.wikipedia.org/wiki/File_system' }] },
      ]},
      { id: 'command-line', title: 'Command Line Mastery', topics: [
        { id: 'bash', title: 'Bash Shell', description: 'Commands, scripting, variables, functions', url: 'https://linux.org', resources: [{ label: 'Bash Manual', url: 'https://www.gnu.org/software/bash/manual/' }] },
        { id: 'tools', title: 'Essential Tools', description: 'grep, sed, awk, find, rsync', url: 'https://linux.org', resources: [{ label: 'GNU Tools', url: 'https://www.gnu.org/manual/' }] },
      ]},
      { id: 'administration', title: 'System Administration', topics: [
        { id: 'users', title: 'User Management', description: 'Users, groups, sudoers, authentication', url: 'https://linux.org', resources: [{ label: 'Users', url: 'https://en.wikipedia.org/wiki/User_account' }] },
        { id: 'services', title: 'Services & Daemons', description: 'systemd, process management, logging', url: 'https://linux.org', resources: [{ label: 'systemd', url: 'https://systemd.io/' }] },
      ]},
    ]
  },

  terraform: {
    id: 'terraform',
    title: 'Terraform',
    description: 'Infrastructure as Code with Terraform',
    icon: '️☁️',
    url: 'https://terraform.io',
    color: '#7B42BC',
    sections: [
      { id: 'basics', title: 'Terraform Basics', topics: [
        { id: 'configuration', title: 'HCL & Configuration', description: 'HCL syntax, providers, resources, variables', url: 'https://terraform.io', resources: [{ label: 'Learn Terraform', url: 'https://learn.hashicorp.com/collections/terraform' }] },
        { id: 'state', title: 'State Management', description: 'State files, remote backends, locking', url: 'https://terraform.io', resources: [{ label: 'State', url: 'https://terraform.io/language/state' }] },
      ]},
      { id: 'aws-gcp', title: 'Cloud Provisioning', topics: [
        { id: 'aws', title: 'AWS Resources', description: 'EC2, S3, RDS, VPC, and more', url: 'https://terraform.io', resources: [{ label: 'AWS Provider', url: 'https://registry.terraform.io/providers/hashicorp/aws' }] },
        { id: 'gcp', title: 'GCP & Azure', description: 'Google Cloud and Microsoft Azure resources', url: 'https://terraform.io', resources: [{ label: 'GCP Provider', url: 'https://registry.terraform.io/providers/hashicorp/google' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'modules', title: 'Modules & Organization', description: 'Reusable modules, workspace management', url: 'https://terraform.io', resources: [{ label: 'Modules', url: 'https://terraform.io/language/modules' }] },
        { id: 'testing', title: 'Testing & Best Practices', description: 'Terraform testing, validation, code organization', url: 'https://terraform.io', resources: [{ label: 'Best Practices', url: 'https://terraform.io/language/expressions' }] },
      ]},
    ]
  },

  redis: {
    id: 'redis',
    title: 'Redis',
    description: 'In-memory data structure store',
    icon: '⚡',
    url: 'https://redis.io',
    color: '#DC382D',
    sections: [
      { id: 'basics', title: 'Redis Basics', topics: [
        { id: 'data-types', title: 'Data Types', description: 'Strings, lists, sets, hashes, sorted sets', url: 'https://redis.io', resources: [{ label: 'Data Types', url: 'https://redis.io/docs/data-types/' }] },
        { id: 'commands', title: 'Redis Commands', description: 'SET, GET, LPUSH, HSET, ZADD, etc.', url: 'https://redis.io', resources: [{ label: 'Commands', url: 'https://redis.io/commands/' }] },
      ]},
      { id: 'caching', title: 'Caching & Performance', topics: [
        { id: 'caching-patterns', title: 'Caching Patterns', description: 'Cache-aside, write-through, write-behind', url: 'https://redis.io', resources: [{ label: 'Caching', url: 'https://redis.io/docs/manual/client-side-caching/' }] },
        { id: 'expiration', title: 'Expiration & TTL', description: 'Key expiration, eviction policies', url: 'https://redis.io', resources: [{ label: 'Expiration', url: 'https://redis.io/docs/manual/data-types-tutorial/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'pubsub', title: 'Pub/Sub & Streams', description: 'Publish/subscribe, stream data', url: 'https://redis.io', resources: [{ label: 'Pub/Sub', url: 'https://redis.io/docs/manual/pubsub/' }] },
        { id: 'replication', title: 'Replication & Clustering', description: 'Master-replica replication, cluster mode', url: 'https://redis.io', resources: [{ label: 'Replication', url: 'https://redis.io/docs/management/replication/' }] },
      ]},
    ]
  },

  html: {
    id: 'html',
    title: 'HTML',
    description: 'HyperText Markup Language fundamentals',
    icon: '🏷️',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    color: '#E34C26',
    sections: [
      { id: 'basics', title: 'HTML Basics', topics: [
        { id: 'syntax', title: 'HTML Syntax', description: 'Elements, tags, attributes, document structure', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'HTML Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }] },
        { id: 'semantic', title: 'Semantic HTML', description: 'header, nav, article, footer, section, main', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Semantic', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics' }] },
        { id: 'headings', title: 'Headings & Text', description: 'h1-h6, paragraphs, spans, strong, em, lists', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Text Content', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element#text_content' }] },
        { id: 'links-images', title: 'Links & Images', description: 'Anchor tags, images, figure, picture element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Images', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML' }] },
      ]},
      { id: 'forms', title: 'Forms & Input', topics: [
        { id: 'form-elements', title: 'Form Elements', description: 'Input types, textarea, select, validation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' }] },
        { id: 'input-types', title: 'Input Types', description: 'text, email, password, number, date, file, range', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Input Types', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input' }] },
        { id: 'validation', title: 'Form Validation', description: 'Required, pattern, min/max, constraint validation API', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Validation', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation' }] },
      ]},
      { id: 'media', title: 'Media & Embedding', topics: [
        { id: 'video-audio', title: 'Video & Audio', description: 'video, audio, source elements, media controls', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Media', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding' }] },
        { id: 'tables', title: 'Tables', description: 'table, thead, tbody, tr, th, td, colspan', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Tables', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables' }] },
        { id: 'iframes', title: 'Iframes & Embedding', description: 'iframe, embed, object for third-party content', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'Iframes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe' }] },
      ]},
      { id: 'accessibility', title: 'Accessibility & SEO', topics: [
        { id: 'aria', title: 'ARIA Attributes', description: 'Roles, states, properties for screen readers', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'ARIA', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA' }] },
        { id: 'seo', title: 'SEO Best Practices', description: 'Meta tags, Open Graph, structured data, sitemap', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'SEO', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML' }] },
        { id: 'html5-apis', title: 'HTML5 APIs', description: 'Canvas, geolocation, web storage, drag & drop', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', resources: [{ label: 'HTML5 APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API' }] },
      ]},
    ]
  },

  php: {
    id: 'php',
    title: 'PHP',
    description: 'Server-side scripting language',
    icon: '🐘',
    url: 'https://php.net',
    color: '#777BB4',
    sections: [
      { id: 'basics', title: 'PHP Basics', topics: [
        { id: 'syntax', title: 'PHP Syntax', description: 'Variables, operators, control structures, functions', url: 'https://php.net', resources: [{ label: 'PHP Manual', url: 'https://php.net/manual' }] },
        { id: 'strings-arrays', title: 'Strings & Arrays', description: 'String functions, array manipulation, sorting', url: 'https://php.net', resources: [{ label: 'Array Functions', url: 'https://php.net/manual/en/ref.array.php' }] },
        { id: 'functions', title: 'Functions', description: 'User-defined functions, closures, variable scope', url: 'https://php.net', resources: [{ label: 'Functions', url: 'https://php.net/manual/en/language.functions.php' }] },
      ]},
      { id: 'oop', title: 'Object-Oriented PHP', topics: [
        { id: 'classes', title: 'Classes & Objects', description: 'Classes, objects, properties, methods', url: 'https://php.net', resources: [{ label: 'OOP', url: 'https://php.net/manual/en/language.oop5.php' }] },
        { id: 'inheritance', title: 'Inheritance & Traits', description: 'Extends, implements, abstract classes, traits', url: 'https://php.net', resources: [{ label: 'Inheritance', url: 'https://php.net/manual/en/language.oop5.inheritance.php' }] },
        { id: 'namespaces', title: 'Namespaces & Autoloading', description: 'PSR-4, Composer autoloader, namespace resolution', url: 'https://php.net', resources: [{ label: 'Namespaces', url: 'https://php.net/manual/en/language.namespaces.php' }] },
      ]},
      { id: 'web', title: 'Web Development', topics: [
        { id: 'superglobals', title: 'Superglobals & Requests', description: '$_GET, $_POST, $_SESSION, $_SERVER, $_COOKIE', url: 'https://php.net', resources: [{ label: 'Superglobals', url: 'https://php.net/manual/en/language.variables.superglobals.php' }] },
        { id: 'databases', title: 'Database Integration', description: 'PDO, mysqli, prepared statements, transactions', url: 'https://php.net', resources: [{ label: 'Database', url: 'https://php.net/manual/en/refs.database.php' }] },
        { id: 'security', title: 'Security', description: 'Input sanitization, CSRF, password hashing, XSS prevention', url: 'https://php.net', resources: [{ label: 'Security', url: 'https://php.net/manual/en/security.php' }] },
      ]},
      { id: 'frameworks', title: 'Frameworks & Tools', topics: [
        { id: 'laravel', title: 'Laravel Framework', description: 'Routing, Eloquent ORM, Blade templates, artisan', url: 'https://php.net', resources: [{ label: 'Laravel', url: 'https://laravel.com' }] },
        { id: 'composer', title: 'Composer', description: 'Dependency management, packages, versioning', url: 'https://php.net', resources: [{ label: 'Composer', url: 'https://getcomposer.org' }] },
        { id: 'testing', title: 'Testing', description: 'PHPUnit, Pest, mocking, test-driven development', url: 'https://php.net', resources: [{ label: 'PHPUnit', url: 'https://phpunit.de' }] },
      ]},
    ]
  },

  kotlin: {
    id: 'kotlin',
    title: 'Kotlin',
    description: 'Modern programming language for JVM',
    icon: '🟣',
    url: 'https://kotlinlang.org',
    color: '#7F52FF',
    sections: [
      { id: 'basics', title: 'Kotlin Basics', topics: [
        { id: 'syntax', title: 'Syntax & Fundamentals', description: 'Variables (val/var), functions, control flow, smart casts', url: 'https://kotlinlang.org', resources: [{ label: 'Kotlin Docs', url: 'https://kotlinlang.org/docs/getting-started.html' }] },
        { id: 'types', title: 'Type System', description: 'Basic types, type inference, type checks, casting', url: 'https://kotlinlang.org', resources: [{ label: 'Types', url: 'https://kotlinlang.org/docs/basic-types.html' }] },
        { id: 'functions', title: 'Functions & Lambdas', description: 'Extension functions, higher-order functions, inline', url: 'https://kotlinlang.org', resources: [{ label: 'Functions', url: 'https://kotlinlang.org/docs/functions.html' }] },
      ]},
      { id: 'oop', title: 'Object-Oriented Programming', topics: [
        { id: 'classes', title: 'Classes & Objects', description: 'Data classes, sealed classes, enum classes', url: 'https://kotlinlang.org', resources: [{ label: 'Classes', url: 'https://kotlinlang.org/docs/classes.html' }] },
        { id: 'inheritance', title: 'Inheritance & Interfaces', description: 'Open classes, abstract classes, interface delegation', url: 'https://kotlinlang.org', resources: [{ label: 'Inheritance', url: 'https://kotlinlang.org/docs/inheritance.html' }] },
        { id: 'nullsafety', title: 'Null Safety', description: 'Nullable types, safe calls, Elvis operator, let/also/apply', url: 'https://kotlinlang.org', resources: [{ label: 'Null Safety', url: 'https://kotlinlang.org/docs/null-safety.html' }] },
      ]},
      { id: 'collections', title: 'Collections & Functional', topics: [
        { id: 'collections', title: 'Collections', description: 'Lists, sets, maps, mutable vs immutable', url: 'https://kotlinlang.org', resources: [{ label: 'Collections', url: 'https://kotlinlang.org/docs/collections-overview.html' }] },
        { id: 'functional', title: 'Functional Programming', description: 'map, filter, reduce, sequences, scope functions', url: 'https://kotlinlang.org', resources: [{ label: 'Functional', url: 'https://kotlinlang.org/docs/collection-transformations.html' }] },
      ]},
      { id: 'advanced', title: 'Advanced Features', topics: [
        { id: 'coroutines', title: 'Coroutines', description: 'Async programming, suspend functions, Flow', url: 'https://kotlinlang.org', resources: [{ label: 'Coroutines', url: 'https://kotlinlang.org/docs/coroutines-overview.html' }] },
        { id: 'generics', title: 'Generics', description: 'Type parameters, variance, reified types', url: 'https://kotlinlang.org', resources: [{ label: 'Generics', url: 'https://kotlinlang.org/docs/generics.html' }] },
        { id: 'dsl', title: 'DSL & Multiplatform', description: 'Type-safe builders, Kotlin Multiplatform (KMP)', url: 'https://kotlinlang.org', resources: [{ label: 'Multiplatform', url: 'https://kotlinlang.org/docs/multiplatform.html' }] },
      ]},
    ]
  },

  swift: {
    id: 'swift',
    title: 'Swift & SwiftUI',
    description: 'Modern Apple programming language',
    icon: '🍎',
    url: 'https://swift.org',
    color: '#FA7343',
    sections: [
      { id: 'basics', title: 'Swift Basics', topics: [
        { id: 'syntax', title: 'Swift Syntax', description: 'Variables, constants, types, control flow, optionals', url: 'https://swift.org', resources: [{ label: 'Swift Book', url: 'https://docs.swift.org/swift-book' }] },
        { id: 'strings-collections', title: 'Strings & Collections', description: 'String interpolation, arrays, dictionaries, sets', url: 'https://swift.org', resources: [{ label: 'Collections', url: 'https://docs.swift.org/swift-book/LanguageGuide/CollectionTypes.html' }] },
        { id: 'functions', title: 'Functions & Closures', description: 'Function definitions, closures, trailing closures, @escaping', url: 'https://swift.org', resources: [{ label: 'Functions', url: 'https://docs.swift.org/swift-book/LanguageGuide/Functions.html' }] },
      ]},
      { id: 'oop', title: 'Object-Oriented Programming', topics: [
        { id: 'classes', title: 'Classes & Structs', description: 'Reference vs value types, inheritance, deinit', url: 'https://swift.org', resources: [{ label: 'Classes', url: 'https://docs.swift.org/swift-book/LanguageGuide/ClassesAndStructures.html' }] },
        { id: 'protocols', title: 'Protocols & Extensions', description: 'Protocol definitions, default implementations, protocol conformance', url: 'https://swift.org', resources: [{ label: 'Protocols', url: 'https://docs.swift.org/swift-book/LanguageGuide/Protocols.html' }] },
        { id: 'enums', title: 'Enums & Error Handling', description: 'Associated values, pattern matching, do-try-catch', url: 'https://swift.org', resources: [{ label: 'Enums', url: 'https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html' }] },
      ]},
      { id: 'advanced', title: 'Advanced Swift', topics: [
        { id: 'generics', title: 'Generics', description: 'Generic functions, types, associated types, constraints', url: 'https://swift.org', resources: [{ label: 'Generics', url: 'https://docs.swift.org/swift-book/LanguageGuide/Generics.html' }] },
        { id: 'concurrency', title: 'Concurrency', description: 'async/await, actors, structured concurrency, Task', url: 'https://swift.org', resources: [{ label: 'Concurrency', url: 'https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html' }] },
        { id: 'memory', title: 'Memory Management', description: 'ARC, strong/weak/unowned references, retain cycles', url: 'https://swift.org', resources: [{ label: 'ARC', url: 'https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html' }] },
      ]},
      { id: 'ui', title: 'SwiftUI Development', topics: [
        { id: 'views', title: 'Views & Layouts', description: 'View protocol, VStack/HStack/ZStack, modifiers', url: 'https://swift.org', resources: [{ label: 'SwiftUI', url: 'https://developer.apple.com/xcode/swiftui/' }] },
        { id: 'state', title: 'State Management', description: '@State, @Binding, @ObservedObject, @EnvironmentObject', url: 'https://swift.org', resources: [{ label: 'State', url: 'https://developer.apple.com/documentation/swiftui/state-and-data-flow' }] },
        { id: 'navigation', title: 'Navigation & Lists', description: 'NavigationStack, NavigationLink, List, ForEach', url: 'https://swift.org', resources: [{ label: 'Navigation', url: 'https://developer.apple.com/documentation/swiftui/navigationstack' }] },
      ]},
    ]
  },

  cpp: {
    id: 'cpp',
    title: 'C++',
    description: 'Powerful systems programming language',
    icon: '⚡',
    url: 'https://cplusplus.com',
    color: '#00599C',
    sections: [
      { id: 'basics', title: 'C++ Basics', topics: [
        { id: 'syntax', title: 'Syntax & Fundamentals', description: 'Variables, data types, operators, control flow, I/O', url: 'https://cplusplus.com', resources: [{ label: 'C++ Reference', url: 'https://cplusplus.com/reference/' }] },
        { id: 'functions', title: 'Functions', description: 'Function overloading, default parameters, inline functions', url: 'https://cplusplus.com', resources: [{ label: 'Functions', url: 'https://cplusplus.com/doc/tutorial/functions/' }] },
        { id: 'arrays', title: 'Arrays & Strings', description: 'C-style arrays, std::array, std::string, string operations', url: 'https://cplusplus.com', resources: [{ label: 'Arrays', url: 'https://cplusplus.com/doc/tutorial/arrays/' }] },
      ]},
      { id: 'memory', title: 'Memory Management', topics: [
        { id: 'pointers', title: 'Pointers & References', description: 'Pointer arithmetic, references, const correctness', url: 'https://cplusplus.com', resources: [{ label: 'Pointers', url: 'https://cplusplus.com/doc/tutorial/pointers/' }] },
        { id: 'dynamic', title: 'Dynamic Memory', description: 'new/delete, memory leaks, RAII pattern', url: 'https://cplusplus.com', resources: [{ label: 'Dynamic Memory', url: 'https://cplusplus.com/doc/tutorial/dynamic/' }] },
        { id: 'smart-ptrs', title: 'Smart Pointers', description: 'unique_ptr, shared_ptr, weak_ptr, ownership semantics', url: 'https://cplusplus.com', resources: [{ label: 'Smart Pointers', url: 'https://en.cppreference.com/w/cpp/memory' }] },
      ]},
      { id: 'oop', title: 'Object-Oriented C++', topics: [
        { id: 'classes', title: 'Classes & Objects', description: 'Encapsulation, constructors, destructors, access specifiers', url: 'https://cplusplus.com', resources: [{ label: 'Classes', url: 'https://cplusplus.com/doc/tutorial/classes/' }] },
        { id: 'inheritance', title: 'Inheritance & Polymorphism', description: 'Virtual functions, abstract classes, multiple inheritance', url: 'https://cplusplus.com', resources: [{ label: 'Inheritance', url: 'https://cplusplus.com/doc/tutorial/inheritance/' }] },
        { id: 'templates', title: 'Templates', description: 'Function templates, class templates, template specialization', url: 'https://cplusplus.com', resources: [{ label: 'Templates', url: 'https://cplusplus.com/doc/oldtutorial/templates/' }] },
      ]},
      { id: 'stl', title: 'Standard Library (STL)', topics: [
        { id: 'containers', title: 'Containers', description: 'vector, map, set, deque, list, unordered_map', url: 'https://cplusplus.com', resources: [{ label: 'Containers', url: 'https://cplusplus.com/reference/stl/' }] },
        { id: 'algorithms', title: 'Algorithms', description: 'sort, find, transform, accumulate, iterators', url: 'https://cplusplus.com', resources: [{ label: 'Algorithms', url: 'https://cplusplus.com/reference/algorithm/' }] },
      ]},
      { id: 'modern', title: 'Modern C++ (11/17/20)', topics: [
        { id: 'cpp11', title: 'C++11 Features', description: 'auto, range-for, lambda, move semantics, nullptr', url: 'https://cplusplus.com', resources: [{ label: 'C++11', url: 'https://en.cppreference.com/w/cpp/11' }] },
        { id: 'cpp17-20', title: 'C++17/20 Features', description: 'Structured bindings, if constexpr, concepts, ranges, coroutines', url: 'https://cplusplus.com', resources: [{ label: 'C++20', url: 'https://en.cppreference.com/w/cpp/20' }] },
        { id: 'concurrency', title: 'Concurrency', description: 'std::thread, mutex, async, futures, atomics', url: 'https://cplusplus.com', resources: [{ label: 'Concurrency', url: 'https://en.cppreference.com/w/cpp/thread' }] },
      ]},
    ]
  },

  aspnetcore: {
    id: 'aspnetcore',
    title: 'ASP.NET Core',
    description: 'Modern framework for building web applications',
    icon: '🔵',
    url: 'https://dotnet.microsoft.com/en-us/apps/aspnet',
    color: '#512BD4',
    sections: [
      { id: 'basics', title: 'ASP.NET Core Basics', topics: [
        { id: 'fundamentals', title: 'Fundamentals', description: 'Middleware, routing, dependency injection, configuration', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'Docs', url: 'https://learn.microsoft.com/en-us/aspnet/core/' }] },
        { id: 'mvc', title: 'MVC Pattern', description: 'Controllers, views, Razor pages, model binding', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'MVC', url: 'https://learn.microsoft.com/en-us/aspnet/core/mvc/overview' }] },
        { id: 'webapi', title: 'Web APIs', description: 'REST API controllers, minimal APIs, content negotiation', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'Web API', url: 'https://learn.microsoft.com/en-us/aspnet/core/web-api/' }] },
      ]},
      { id: 'data', title: 'Data Access', topics: [
        { id: 'entity-framework', title: 'Entity Framework Core', description: 'ORM, DbContext, migrations, relationships, LINQ', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'EF Core', url: 'https://learn.microsoft.com/en-us/ef/core/' }] },
        { id: 'dapper', title: 'Dapper', description: 'Micro ORM for raw SQL queries with mapping', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'Dapper', url: 'https://github.com/DapperLib/Dapper' }] },
      ]},
      { id: 'security', title: 'Security & Auth', topics: [
        { id: 'identity', title: 'ASP.NET Identity', description: 'User management, roles, claims, cookie auth', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'Identity', url: 'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity' }] },
        { id: 'jwt', title: 'JWT & OAuth', description: 'Token-based auth, OAuth2, OpenID Connect', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'JWT Auth', url: 'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'signalr', title: 'SignalR', description: 'Real-time communication, WebSockets, hubs', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'SignalR', url: 'https://learn.microsoft.com/en-us/aspnet/core/signalr/' }] },
        { id: 'testing', title: 'Testing', description: 'xUnit, integration testing, WebApplicationFactory', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'Testing', url: 'https://learn.microsoft.com/en-us/aspnet/core/test/' }] },
        { id: 'deployment', title: 'Deployment', description: 'Docker, Azure App Service, IIS, CI/CD', url: 'https://dotnet.microsoft.com/en-us/apps/aspnet', resources: [{ label: 'Hosting', url: 'https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/' }] },
      ]},
    ]
  },

  flutter: {
    id: 'flutter',
    title: 'Flutter',
    description: 'Cross-platform mobile development',
    icon: '💙',
    url: 'https://flutter.dev',
    color: '#02569B',
    sections: [
      { id: 'dart', title: 'Dart Programming', topics: [
        { id: 'dart-basics', title: 'Dart Basics', description: 'Variables, types, functions, OOP, null safety', url: 'https://flutter.dev', resources: [{ label: 'Dart', url: 'https://dart.dev/guides' }] },
        { id: 'async', title: 'Async Programming', description: 'Futures, async/await, Streams, Isolates', url: 'https://flutter.dev', resources: [{ label: 'Async', url: 'https://dart.dev/codelabs/async-await' }] },
      ]},
      { id: 'basics', title: 'Flutter Basics', topics: [
        { id: 'widgets', title: 'Widgets & UI', description: 'Stateless, stateful widgets, widget tree, keys', url: 'https://flutter.dev', resources: [{ label: 'Widgets', url: 'https://flutter.dev/docs/development/ui/widgets' }] },
        { id: 'layouts', title: 'Layouts', description: 'Row, Column, Stack, Container, Expanded, Flexible', url: 'https://flutter.dev', resources: [{ label: 'Layouts', url: 'https://flutter.dev/docs/development/ui/layout' }] },
        { id: 'styling', title: 'Styling & Themes', description: 'ThemeData, Material Design, custom themes, fonts', url: 'https://flutter.dev', resources: [{ label: 'Themes', url: 'https://flutter.dev/docs/cookbook/design/themes' }] },
      ]},
      { id: 'development', title: 'App Development', topics: [
        { id: 'state-management', title: 'State Management', description: 'Provider, Riverpod, BLoC, GetX, setState', url: 'https://flutter.dev', resources: [{ label: 'State Mgmt', url: 'https://flutter.dev/docs/development/data-and-backend/state-mgmt' }] },
        { id: 'navigation', title: 'Navigation & Routing', description: 'Navigator 2.0, named routes, deep linking, GoRouter', url: 'https://flutter.dev', resources: [{ label: 'Navigation', url: 'https://flutter.dev/docs/development/ui/navigation' }] },
        { id: 'networking', title: 'Networking', description: 'HTTP requests, Dio, REST API integration, JSON parsing', url: 'https://flutter.dev', resources: [{ label: 'Networking', url: 'https://flutter.dev/docs/cookbook/networking' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'plugins', title: 'Packages & Plugins', description: 'Using pub.dev, camera, location, permissions', url: 'https://flutter.dev', resources: [{ label: 'Pub.dev', url: 'https://pub.dev' }] },
        { id: 'animations', title: 'Animations', description: 'Implicit, explicit animations, Hero, AnimationController', url: 'https://flutter.dev', resources: [{ label: 'Animations', url: 'https://flutter.dev/docs/development/ui/animations' }] },
        { id: 'testing', title: 'Testing & Deployment', description: 'Widget/unit/integration tests, App Store, Play Store', url: 'https://flutter.dev', resources: [{ label: 'Testing', url: 'https://flutter.dev/docs/testing' }] },
      ]},
    ]
  },

  reactnative: {
    id: 'reactnative',
    title: 'React Native',
    description: 'Cross-platform mobile with JavaScript',
    icon: '⚛️',
    url: 'https://reactnative.dev',
    color: '#61DAFB',
    sections: [
      { id: 'basics', title: 'React Native Basics', topics: [
        { id: 'setup', title: 'Setup & Environment', description: 'Expo, CLI, development setup, simulators', url: 'https://reactnative.dev', resources: [{ label: 'Getting Started', url: 'https://reactnative.dev/docs/getting-started' }] },
        { id: 'components', title: 'Core Components', description: 'View, Text, Image, ScrollView, FlatList, TouchableOpacity', url: 'https://reactnative.dev', resources: [{ label: 'Components', url: 'https://reactnative.dev/docs/components-and-apis' }] },
        { id: 'styling', title: 'Styling', description: 'StyleSheet, Flexbox, platform-specific styles', url: 'https://reactnative.dev', resources: [{ label: 'Style', url: 'https://reactnative.dev/docs/style' }] },
      ]},
      { id: 'navigation', title: 'Navigation & State', topics: [
        { id: 'react-navigation', title: 'React Navigation', description: 'Stack, tab, drawer, deep linking', url: 'https://reactnative.dev', resources: [{ label: 'Navigation', url: 'https://reactnavigation.org' }] },
        { id: 'state-management', title: 'State Management', description: 'Redux, Zustand, Context API, AsyncStorage', url: 'https://reactnative.dev', resources: [{ label: 'Redux', url: 'https://redux.js.org' }] },
      ]},
      { id: 'apis', title: 'APIs & Networking', topics: [
        { id: 'fetch', title: 'Networking', description: 'Fetch API, Axios, REST integration, websockets', url: 'https://reactnative.dev', resources: [{ label: 'Networking', url: 'https://reactnative.dev/docs/network' }] },
        { id: 'storage', title: 'Local Storage', description: 'AsyncStorage, SQLite, Realm, MMKV', url: 'https://reactnative.dev', resources: [{ label: 'Storage', url: 'https://reactnative.dev/docs/asyncstorage' }] },
      ]},
      { id: 'native', title: 'Native Integration & Deployment', topics: [
        { id: 'native-modules', title: 'Native Modules', description: 'Bridge, Turbo Modules, Fabric, native views', url: 'https://reactnative.dev', resources: [{ label: 'Native Modules', url: 'https://reactnative.dev/docs/native-modules-intro' }] },
        { id: 'animations', title: 'Animations', description: 'Animated API, Reanimated, gesture handler', url: 'https://reactnative.dev', resources: [{ label: 'Animated', url: 'https://reactnative.dev/docs/animated' }] },
        { id: 'deployment', title: 'Deployment', description: 'Expo EAS, app stores, OTA updates, code signing', url: 'https://reactnative.dev', resources: [{ label: 'Publishing', url: 'https://docs.expo.dev/build-reference/apk' }] },
      ]},
    ]
  },

  django: {
    id: 'django',
    title: 'Django',
    description: 'Web framework for Python',
    icon: '🌿',
    url: 'https://djangoproject.com',
    color: '#092E20',
    sections: [
      { id: 'basics', title: 'Django Basics', topics: [
        { id: 'setup', title: 'Project Setup', description: 'Installation, project structure, settings, manage.py', url: 'https://djangoproject.com', resources: [{ label: 'Documentation', url: 'https://docs.djangoproject.com' }] },
        { id: 'apps', title: 'Apps & Models', description: 'App creation, models, fields, relationships, migrations', url: 'https://djangoproject.com', resources: [{ label: 'Models', url: 'https://docs.djangoproject.com/en/stable/topics/db/models/' }] },
        { id: 'admin', title: 'Admin Interface', description: 'Django admin, ModelAdmin, customization', url: 'https://djangoproject.com', resources: [{ label: 'Admin', url: 'https://docs.djangoproject.com/en/stable/ref/contrib/admin/' }] },
      ]},
      { id: 'views', title: 'Views & Templates', topics: [
        { id: 'views', title: 'Views & URLs', description: 'Function-based, class-based views, URL patterns', url: 'https://djangoproject.com', resources: [{ label: 'Views', url: 'https://docs.djangoproject.com/en/stable/topics/http/views/' }] },
        { id: 'templates', title: 'Templates', description: 'Django template language, template inheritance, filters', url: 'https://djangoproject.com', resources: [{ label: 'Templates', url: 'https://docs.djangoproject.com/en/stable/topics/templates/' }] },
        { id: 'forms', title: 'Forms & Validation', description: 'Model forms, form validation, CSRF protection', url: 'https://djangoproject.com', resources: [{ label: 'Forms', url: 'https://docs.djangoproject.com/en/stable/topics/forms/' }] },
      ]},
      { id: 'data', title: 'Database & ORM', topics: [
        { id: 'querysets', title: 'QuerySets', description: 'Querying, filtering, aggregation, Q objects', url: 'https://djangoproject.com', resources: [{ label: 'QuerySets', url: 'https://docs.djangoproject.com/en/stable/ref/models/querysets/' }] },
        { id: 'relationships', title: 'Relationships', description: 'ForeignKey, ManyToMany, OneToOne, prefetch_related', url: 'https://djangoproject.com', resources: [{ label: 'Relations', url: 'https://docs.djangoproject.com/en/stable/topics/db/models/#relationships' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'auth', title: 'Authentication', description: 'User model, login/logout, permissions, groups', url: 'https://djangoproject.com', resources: [{ label: 'Auth', url: 'https://docs.djangoproject.com/en/stable/topics/auth/' }] },
        { id: 'rest-api', title: 'REST APIs', description: 'Django REST Framework, serializers, viewsets, routers', url: 'https://djangoproject.com', resources: [{ label: 'DRF', url: 'https://www.django-rest-framework.org' }] },
        { id: 'deployment', title: 'Deployment', description: 'Gunicorn, Nginx, Docker, static files, Heroku', url: 'https://djangoproject.com', resources: [{ label: 'Deploy', url: 'https://docs.djangoproject.com/en/stable/howto/deployment/' }] },
      ]},
    ]
  },

  laravel: {
    id: 'laravel',
    title: 'Laravel',
    description: 'Elegant PHP web framework',
    icon: '🔴',
    url: 'https://laravel.com',
    color: '#FF2D20',
    sections: [
      { id: 'basics', title: 'Laravel Basics', topics: [
        { id: 'setup', title: 'Project Setup', description: 'Composer, project structure, .env configuration', url: 'https://laravel.com', resources: [{ label: 'Documentation', url: 'https://laravel.com/docs' }] },
        { id: 'routing', title: 'Routing & Controllers', description: 'Route definitions, resource controllers, middleware', url: 'https://laravel.com', resources: [{ label: 'Routing', url: 'https://laravel.com/docs/routing' }] },
        { id: 'blade', title: 'Blade Templates', description: 'Template syntax, layouts, components, directives', url: 'https://laravel.com', resources: [{ label: 'Blade', url: 'https://laravel.com/docs/blade' }] },
      ]},
      { id: 'data', title: 'Database & Eloquent', topics: [
        { id: 'eloquent', title: 'Eloquent ORM', description: 'Models, relationships, scopes, accessors/mutators', url: 'https://laravel.com', resources: [{ label: 'Eloquent', url: 'https://laravel.com/docs/eloquent' }] },
        { id: 'migrations', title: 'Migrations & Seeding', description: 'Schema builder, migrations, seeders, factories', url: 'https://laravel.com', resources: [{ label: 'Migrations', url: 'https://laravel.com/docs/migrations' }] },
        { id: 'query-builder', title: 'Query Builder', description: 'Fluent queries, joins, aggregates, raw expressions', url: 'https://laravel.com', resources: [{ label: 'Query Builder', url: 'https://laravel.com/docs/queries' }] },
      ]},
      { id: 'auth-security', title: 'Auth & Security', topics: [
        { id: 'auth', title: 'Authentication', description: 'Breeze, Jetstream, Sanctum, Passport', url: 'https://laravel.com', resources: [{ label: 'Auth', url: 'https://laravel.com/docs/authentication' }] },
        { id: 'authorization', title: 'Authorization', description: 'Gates, policies, roles, permissions', url: 'https://laravel.com', resources: [{ label: 'Authorization', url: 'https://laravel.com/docs/authorization' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'queues', title: 'Queues & Jobs', description: 'Job dispatching, workers, failed jobs, scheduling', url: 'https://laravel.com', resources: [{ label: 'Queues', url: 'https://laravel.com/docs/queues' }] },
        { id: 'api', title: 'API Development', description: 'API resources, pagination, rate limiting, versioning', url: 'https://laravel.com', resources: [{ label: 'API', url: 'https://laravel.com/docs/eloquent-resources' }] },
        { id: 'testing', title: 'Testing', description: 'PHPUnit, Pest, HTTP tests, database testing', url: 'https://laravel.com', resources: [{ label: 'Testing', url: 'https://laravel.com/docs/testing' }] },
      ]},
    ]
  },

  ruby: {
    id: 'ruby',
    title: 'Ruby',
    description: 'Dynamic, expressive programming language',
    icon: '💎',
    url: 'https://ruby-lang.org',
    color: '#CC342D',
    sections: [
      { id: 'basics', title: 'Ruby Basics', topics: [
        { id: 'syntax', title: 'Syntax & Fundamentals', description: 'Variables, data types, operators, control flow, puts/gets', url: 'https://ruby-lang.org', resources: [{ label: 'Ruby Docs', url: 'https://ruby-doc.org' }] },
        { id: 'collections', title: 'Collections', description: 'Arrays, hashes, ranges, iterators, enumerables', url: 'https://ruby-lang.org', resources: [{ label: 'Collections', url: 'https://ruby-doc.org/core/Enumerable.html' }] },
        { id: 'functions', title: 'Methods & Blocks', description: 'Methods, blocks, procs, lambdas, yield', url: 'https://ruby-lang.org', resources: [{ label: 'Methods', url: 'https://ruby-doc.org/docs/ruby-doc-bundle/Manual/manual.html' }] },
      ]},
      { id: 'oop', title: 'Object-Oriented Ruby', topics: [
        { id: 'classes', title: 'Classes & Modules', description: 'Classes, inheritance, mixins, modules, attr_accessor', url: 'https://ruby-lang.org', resources: [{ label: 'Classes', url: 'https://ruby-doc.org/docs/ruby-doc-bundle/Manual/manual.html' }] },
        { id: 'metaprogramming', title: 'Metaprogramming', description: 'Dynamic methods, method_missing, define_method, eval', url: 'https://ruby-lang.org', resources: [{ label: 'Metaprogramming', url: 'https://en.wikipedia.org/wiki/Metaprogramming' }] },
      ]},
      { id: 'gems', title: 'Gems & Testing', topics: [
        { id: 'bundler', title: 'Bundler & Gems', description: 'Gemfile, bundler, publishing gems, rubygems.org', url: 'https://ruby-lang.org', resources: [{ label: 'RubyGems', url: 'https://rubygems.org' }] },
        { id: 'rspec', title: 'RSpec & Testing', description: 'RSpec, Minitest, TDD, mocking, factories', url: 'https://ruby-lang.org', resources: [{ label: 'RSpec', url: 'https://rspec.info' }] },
      ]},
      { id: 'rails', title: 'Ruby on Rails', topics: [
        { id: 'framework', title: 'Rails Framework', description: 'MVC, routing, ActiveRecord, ActionView, generators', url: 'https://ruby-lang.org', resources: [{ label: 'Rails', url: 'https://rubyonrails.org' }] },
        { id: 'apis', title: 'Rails APIs', description: 'API mode, serializers, Jbuilder, authentication', url: 'https://ruby-lang.org', resources: [{ label: 'Rails API', url: 'https://guides.rubyonrails.org/api_app.html' }] },
        { id: 'deployment', title: 'Deployment', description: 'Capistrano, Heroku, Docker, Puma, Sidekiq', url: 'https://ruby-lang.org', resources: [{ label: 'Deploy', url: 'https://guides.rubyonrails.org/configuring.html' }] },
      ]},
    ]
  },

  bash: {
    id: 'bash',
    title: 'Shell / Bash',
    description: 'Shell scripting and command-line mastery',
    icon: '💻',
    url: 'https://www.gnu.org/software/bash/',
    color: '#4EAA25',
    sections: [
      { id: 'basics', title: 'Bash Basics', topics: [
        { id: 'syntax', title: 'Bash Syntax', description: 'Variables, operators, control structures, quoting', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Bash Manual', url: 'https://www.gnu.org/software/bash/manual/' }] },
        { id: 'commands', title: 'Essential Commands', description: 'pwd, ls, cd, mkdir, rm, cp, mv, cat, less, head/tail', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Commands', url: 'https://en.wikipedia.org/wiki/List_of_Unix_commands' }] },
        { id: 'pipes', title: 'Pipes & Redirection', description: '|, >, >>, <, 2>, tee, xargs, command substitution', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Redirection', url: 'https://www.gnu.org/software/bash/manual/bash.html#Redirections' }] },
      ]},
      { id: 'scripting', title: 'Shell Scripting', topics: [
        { id: 'functions', title: 'Functions & Scripts', description: 'Functions, arguments ($1-$9), exit codes, source', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Scripting', url: 'https://www.bash.academy' }] },
        { id: 'flow', title: 'Flow Control', description: 'if/else, case, for, while, until, select', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Flow Control', url: 'https://www.gnu.org/software/bash/manual/bash.html#Conditional-Constructs' }] },
        { id: 'arrays', title: 'Arrays & Strings', description: 'Indexed arrays, associative arrays, string manipulation', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Arrays', url: 'https://www.gnu.org/software/bash/manual/bash.html#Arrays' }] },
      ]},
      { id: 'text', title: 'Text Processing', topics: [
        { id: 'grep-sed', title: 'grep & sed', description: 'Pattern matching, stream editing, in-place edits', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'grep', url: 'https://www.gnu.org/software/grep/' }] },
        { id: 'awk', title: 'awk', description: 'Field processing, patterns, one-liners, reporting', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'awk', url: 'https://www.gnu.org/software/gawk/' }] },
        { id: 'regex', title: 'Regular Expressions', description: 'Basic/extended regex, character classes, anchors, groups', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Regex', url: 'https://en.wikipedia.org/wiki/Regular_expression' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'process', title: 'Process Management', description: 'ps, top, kill, jobs, bg, fg, nohup, signals', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'Processes', url: 'https://www.gnu.org/software/bash/manual/bash.html#Job-Control' }] },
        { id: 'debugging', title: 'Debugging & Best Practices', description: 'set -e/x/u, shellcheck, error handling, logging', url: 'https://www.gnu.org/software/bash/', resources: [{ label: 'ShellCheck', url: 'https://www.shellcheck.net' }] },
      ]},
    ]
  },

  machinelearning: {
    id: 'machinelearning',
    title: 'Machine Learning',
    description: 'Build intelligent systems with ML algorithms',
    icon: '🧠',
    url: 'https://roadmap.sh/machine-learning',
    color: '#FF6D00',
    sections: [
      { id: 'math', title: 'Mathematics Foundation', topics: [
        { id: 'linear-algebra', title: 'Linear Algebra', description: 'Vectors, matrices, eigenvalues, SVD', url: 'https://roadmap.sh/machine-learning', resources: [{ label: '3Blue1Brown', url: 'https://www.3blue1brown.com/topics/linear-algebra' }] },
        { id: 'calculus', title: 'Calculus', description: 'Derivatives, gradients, chain rule, optimization', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Khan Academy', url: 'https://www.khanacademy.org/math/calculus-1' }] },
        { id: 'statistics', title: 'Statistics & Probability', description: 'Distributions, Bayes theorem, hypothesis testing', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'StatQuest', url: 'https://statquest.org' }] },
      ]},
      { id: 'fundamentals', title: 'ML Fundamentals', topics: [
        { id: 'supervised', title: 'Supervised Learning', description: 'Regression, classification, decision trees, SVM', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Scikit-Learn', url: 'https://scikit-learn.org' }] },
        { id: 'unsupervised', title: 'Unsupervised Learning', description: 'Clustering, dimensionality reduction, PCA, K-means', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Algorithms', url: 'https://scikit-learn.org/stable/unsupervised_learning.html' }] },
        { id: 'evaluation', title: 'Model Evaluation', description: 'Cross-validation, metrics, overfitting, regularization', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Evaluation', url: 'https://scikit-learn.org/stable/model_selection.html' }] },
      ]},
      { id: 'deep-learning', title: 'Deep Learning', topics: [
        { id: 'neural-networks', title: 'Neural Networks', description: 'Perceptrons, backpropagation, activation functions', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Deep Learning Book', url: 'https://www.deeplearningbook.org' }] },
        { id: 'cnn', title: 'CNNs & RNNs', description: 'Convolutional, recurrent, LSTM, transformer architectures', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'CS231n', url: 'https://cs231n.stanford.edu' }] },
      ]},
      { id: 'frameworks', title: 'Frameworks & Tools', topics: [
        { id: 'sklearn', title: 'Scikit-Learn', description: 'ML library for Python, pipelines, preprocessing', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Scikit-Learn', url: 'https://scikit-learn.org' }] },
        { id: 'tensorflow', title: 'TensorFlow & PyTorch', description: 'Deep learning frameworks, Keras, model training', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'TensorFlow', url: 'https://tensorflow.org' }] },
        { id: 'tools', title: 'Data Tools', description: 'Pandas, NumPy, Matplotlib, Jupyter notebooks', url: 'https://roadmap.sh/machine-learning', resources: [{ label: 'Pandas', url: 'https://pandas.pydata.org' }] },
      ]},
    ]
  },

  qa: {
    id: 'qa',
    title: 'QA / Testing',
    description: 'Quality assurance and software testing',
    icon: '✓',
    url: 'https://roadmap.sh/qa',
    color: '#2E7D32',
    sections: [
      { id: 'fundamentals', title: 'QA Fundamentals', topics: [
        { id: 'concepts', title: 'Testing Concepts', description: 'Test types, strategies, coverage, test pyramid', url: 'https://roadmap.sh/qa', resources: [{ label: 'QA', url: 'https://en.wikipedia.org/wiki/Software_testing' }] },
        { id: 'manual', title: 'Manual Testing', description: 'Exploratory, functional, regression, acceptance testing', url: 'https://roadmap.sh/qa', resources: [{ label: 'Manual Testing', url: 'https://en.wikipedia.org/wiki/Manual_testing' }] },
        { id: 'test-design', title: 'Test Design', description: 'Test cases, test plans, boundary analysis, equivalence partitioning', url: 'https://roadmap.sh/qa', resources: [{ label: 'Test Design', url: 'https://en.wikipedia.org/wiki/Test_design' }] },
      ]},
      { id: 'automation', title: 'Test Automation', topics: [
        { id: 'frameworks', title: 'Automation Frameworks', description: 'Selenium, Cypress, Playwright, WebdriverIO', url: 'https://roadmap.sh/qa', resources: [{ label: 'Selenium', url: 'https://selenium.dev' }] },
        { id: 'unit-testing', title: 'Unit Testing', description: 'JUnit, Jest, Pytest, Mocha, mocking, stubs', url: 'https://roadmap.sh/qa', resources: [{ label: 'Jest', url: 'https://jestjs.io' }] },
        { id: 'api-testing', title: 'API Testing', description: 'Postman, REST Assured, contract testing', url: 'https://roadmap.sh/qa', resources: [{ label: 'Postman', url: 'https://www.postman.com' }] },
      ]},
      { id: 'specialised', title: 'Specialized Testing', topics: [
        { id: 'performance', title: 'Performance Testing', description: 'Load testing, stress testing, JMeter, k6', url: 'https://roadmap.sh/qa', resources: [{ label: 'k6', url: 'https://k6.io' }] },
        { id: 'security-testing', title: 'Security Testing', description: 'OWASP, penetration testing, vulnerability scanning', url: 'https://roadmap.sh/qa', resources: [{ label: 'OWASP', url: 'https://owasp.org' }] },
      ]},
      { id: 'cicd', title: 'CI/CD & Reporting', topics: [
        { id: 'cicd-integration', title: 'CI/CD Integration', description: 'GitHub Actions, Jenkins, automated test pipelines', url: 'https://roadmap.sh/qa', resources: [{ label: 'CI/CD', url: 'https://en.wikipedia.org/wiki/Continuous_integration' }] },
        { id: 'reporting', title: 'Test Reporting', description: 'Allure, test coverage reports, dashboards', url: 'https://roadmap.sh/qa', resources: [{ label: 'Allure', url: 'https://allurereport.org' }] },
      ]},
    ]
  },

  softwarearchitect: {
    id: 'softwarearchitect',
    title: 'Software Architect',
    description: 'Design scalable and maintainable software systems',
    icon: '🏛️',
    url: 'https://roadmap.sh/software-architect',
    color: '#1976D2',
    sections: [
      { id: 'principles', title: 'Design Principles', topics: [
        { id: 'solid', title: 'SOLID Principles', description: 'Single Responsibility, Open/Closed, Liskov, Interface Segregation, DIP', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'SOLID', url: 'https://en.wikipedia.org/wiki/SOLID' }] },
        { id: 'design-patterns', title: 'Design Patterns', description: 'Creational, structural, behavioral patterns (GoF)', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'Patterns', url: 'https://refactoring.guru/design-patterns' }] },
        { id: 'clean-arch', title: 'Clean Architecture', description: 'Hexagonal, onion architecture, dependency rule', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'Clean Arch', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html' }] },
      ]},
      { id: 'styles', title: 'Architecture Styles', topics: [
        { id: 'microservices', title: 'Microservices', description: 'Service decomposition, API gateway, service mesh', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'Microservices', url: 'https://microservices.io' }] },
        { id: 'event-driven', title: 'Event-Driven', description: 'Event sourcing, CQRS, message queues, Kafka', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'Event-Driven', url: 'https://en.wikipedia.org/wiki/Event-driven_architecture' }] },
        { id: 'monolith', title: 'Monolith & SOA', description: 'Modular monolith, service-oriented architecture', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'SOA', url: 'https://en.wikipedia.org/wiki/Service-oriented_architecture' }] },
      ]},
      { id: 'distributed', title: 'Distributed Systems', topics: [
        { id: 'cap', title: 'CAP Theorem', description: 'Consistency, availability, partition tolerance tradeoffs', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'CAP', url: 'https://en.wikipedia.org/wiki/CAP_theorem' }] },
        { id: 'scalability', title: 'Scalability Patterns', description: 'Horizontal/vertical scaling, caching, load balancing, CDN', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'Scaling', url: 'https://en.wikipedia.org/wiki/Scalability' }] },
      ]},
      { id: 'documentation', title: 'Documentation & Communication', topics: [
        { id: 'diagrams', title: 'Architecture Diagrams', description: 'C4 model, UML, sequence diagrams, ADRs', url: 'https://roadmap.sh/software-architect', resources: [{ label: 'C4 Model', url: 'https://c4model.com' }] },
      ]},
    ]
  },

  apidesign: {
    id: 'apidesign',
    title: 'API Design',
    description: 'Design effective and scalable APIs',
    icon: '🔌',
    url: 'https://roadmap.sh/api-design',
    color: '#FF5722',
    sections: [
      { id: 'fundamentals', title: 'API Fundamentals', topics: [
        { id: 'rest', title: 'REST APIs', description: 'RESTful principles, HTTP methods, status codes, HATEOAS', url: 'https://roadmap.sh/api-design', resources: [{ label: 'REST', url: 'https://restful-api.com' }] },
        { id: 'graphql', title: 'GraphQL', description: 'Queries, mutations, subscriptions, schema design', url: 'https://roadmap.sh/api-design', resources: [{ label: 'GraphQL', url: 'https://graphql.org' }] },
        { id: 'grpc', title: 'gRPC', description: 'Protocol buffers, streaming, service definitions', url: 'https://roadmap.sh/api-design', resources: [{ label: 'gRPC', url: 'https://grpc.io' }] },
      ]},
      { id: 'design', title: 'Design Best Practices', topics: [
        { id: 'versioning', title: 'Versioning & Naming', description: 'URL versioning, header versioning, naming conventions', url: 'https://roadmap.sh/api-design', resources: [{ label: 'Design Guide', url: 'https://restfulapi.net' }] },
        { id: 'pagination', title: 'Pagination & Filtering', description: 'Cursor vs offset pagination, filtering, sorting', url: 'https://roadmap.sh/api-design', resources: [{ label: 'Pagination', url: 'https://restfulapi.net/rest-api-pagination/' }] },
        { id: 'errors', title: 'Error Handling', description: 'Error formats, problem details (RFC 7807), validation', url: 'https://roadmap.sh/api-design', resources: [{ label: 'Error Handling', url: 'https://restfulapi.net/http-status-codes/' }] },
      ]},
      { id: 'security', title: 'Security & Auth', topics: [
        { id: 'auth', title: 'Authentication', description: 'API keys, OAuth2, JWT, bearer tokens', url: 'https://roadmap.sh/api-design', resources: [{ label: 'Auth', url: 'https://oauth.net/2/' }] },
        { id: 'rate-limiting', title: 'Rate Limiting', description: 'Throttling, quota management, retry-after headers', url: 'https://roadmap.sh/api-design', resources: [{ label: 'Rate Limiting', url: 'https://en.wikipedia.org/wiki/Rate_limiting' }] },
      ]},
      { id: 'docs', title: 'Documentation & Testing', topics: [
        { id: 'documentation', title: 'API Documentation', description: 'OpenAPI/Swagger, Redoc, API reference, examples', url: 'https://roadmap.sh/api-design', resources: [{ label: 'OpenAPI', url: 'https://www.openapis.org' }] },
        { id: 'testing', title: 'API Testing', description: 'Postman, contract testing, mocking, load testing', url: 'https://roadmap.sh/api-design', resources: [{ label: 'Postman', url: 'https://www.postman.com' }] },
      ]},
    ]
  },

  cybersecurity: {
    id: 'cybersecurity',
    title: 'Cyber Security',
    description: 'Protect systems from security threats',
    icon: '🔐',
    url: 'https://roadmap.sh/cyber-security',
    color: '#D32F2F',
    sections: [
      { id: 'fundamentals', title: 'Security Fundamentals', topics: [
        { id: 'concepts', title: 'Security Concepts', description: 'CIA triad, threat modeling, risk assessment, defense in depth', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'OWASP', url: 'https://owasp.org' }] },
        { id: 'cryptography', title: 'Cryptography', description: 'Symmetric/asymmetric encryption, hashing, digital signatures', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'Crypto', url: 'https://en.wikipedia.org/wiki/Cryptography' }] },
        { id: 'networking', title: 'Network Security', description: 'Firewalls, IDS/IPS, VPN, TLS/SSL, DNS security', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'Network Security', url: 'https://en.wikipedia.org/wiki/Network_security' }] },
      ]},
      { id: 'application', title: 'Application Security', topics: [
        { id: 'vulnerabilities', title: 'OWASP Top 10', description: 'SQL injection, XSS, CSRF, broken auth, SSRF', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' }] },
        { id: 'secure-coding', title: 'Secure Coding', description: 'Input validation, output encoding, parameterized queries', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'Secure Coding', url: 'https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/' }] },
      ]},
      { id: 'testing', title: 'Security Testing', topics: [
        { id: 'pentesting', title: 'Penetration Testing', description: 'Recon, scanning, exploitation, reporting, tools', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'Pentest Guide', url: 'https://owasp.org/www-project-testing-guide/' }] },
        { id: 'tools', title: 'Security Tools', description: 'Burp Suite, Nmap, Wireshark, Metasploit, OWASP ZAP', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'Tools', url: 'https://owasp.org/www-project-zap/' }] },
      ]},
      { id: 'operations', title: 'Security Operations', topics: [
        { id: 'soc', title: 'SOC & Incident Response', description: 'SIEM, log analysis, incident handling, forensics', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'NIST IR', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final' }] },
        { id: 'compliance', title: 'Compliance', description: 'GDPR, HIPAA, SOC2, ISO 27001, PCI-DSS', url: 'https://roadmap.sh/cyber-security', resources: [{ label: 'ISO 27001', url: 'https://www.iso.org/isoiec-27001-information-security.html' }] },
      ]},
    ]
  },

  uxdesign: {
    id: 'uxdesign',
    title: 'UX Design',
    description: 'Create user-centered digital experiences',
    icon: '🎨',
    url: 'https://roadmap.sh/ux-design',
    color: '#7B1FA2',
    sections: [
      { id: 'fundamentals', title: 'UX Fundamentals', topics: [
        { id: 'principles', title: 'Design Principles', description: 'Usability heuristics, Gestalt laws, accessibility, WCAG', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'Heuristics', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/' }] },
        { id: 'research', title: 'User Research', description: 'User interviews, surveys, personas, user journey maps', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'Research', url: 'https://www.nngroup.com/articles/user-research-methods/' }] },
      ]},
      { id: 'design', title: 'Design Process', topics: [
        { id: 'wireframing', title: 'Wireframing & Prototyping', description: 'Lo-fi/hi-fi wireframes, interactive prototypes, user flows', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'Prototyping', url: 'https://en.wikipedia.org/wiki/Prototype' }] },
        { id: 'information-arch', title: 'Information Architecture', description: 'Site maps, card sorting, navigation design, content strategy', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'IA', url: 'https://en.wikipedia.org/wiki/Information_architecture' }] },
      ]},
      { id: 'tools', title: 'Tools & Handoff', topics: [
        { id: 'design-tools', title: 'Design Tools', description: 'Figma, Adobe XD, Sketch, InVision, Framer', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'Figma', url: 'https://figma.com' }] },
        { id: 'handoff', title: 'Design Handoff', description: 'Design tokens, specs, design systems, developer collaboration', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'Zeplin', url: 'https://zeplin.io' }] },
      ]},
      { id: 'testing', title: 'Usability Testing', topics: [
        { id: 'user-testing', title: 'User Testing', description: 'Moderated/unmoderated testing, A/B testing, eye tracking', url: 'https://roadmap.sh/ux-design', resources: [{ label: 'Testing', url: 'https://www.nngroup.com/articles/usability-testing-101/' }] },
      ]},
    ]
  },

  promptengineering: {
    id: 'promptengineering',
    title: 'Prompt Engineering',
    description: 'Master the art of effective AI prompting',
    icon: '💬',
    url: 'https://roadmap.sh/prompt-engineering',
    color: '#F44336',
    sections: [
      { id: 'basics', title: 'Prompt Basics', topics: [
        { id: 'fundamentals', title: 'LLM Fundamentals', description: 'How LLMs work, tokenization, context windows, temperature', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Prompting Guide', url: 'https://www.promptingguide.ai' }] },
        { id: 'structure', title: 'Prompt Structure', description: 'System prompts, user prompts, roles, formatting', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Structure', url: 'https://www.promptingguide.ai/introduction/basics' }] },
      ]},
      { id: 'techniques', title: 'Prompting Techniques', topics: [
        { id: 'basic-techniques', title: 'Core Techniques', description: 'Zero-shot, few-shot, chain-of-thought, self-consistency', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Techniques', url: 'https://www.promptingguide.ai/techniques' }] },
        { id: 'advanced-techniques', title: 'Advanced Techniques', description: 'Tree-of-thought, ReAct, RAG, prompt chaining', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Advanced', url: 'https://www.promptingguide.ai/techniques/tot' }] },
      ]},
      { id: 'applications', title: 'Applications', topics: [
        { id: 'code-gen', title: 'Code Generation', description: 'Code completion, debugging, refactoring with AI', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Code', url: 'https://www.promptingguide.ai/applications' }] },
        { id: 'content', title: 'Content & Analysis', description: 'Content creation, summarization, data extraction', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Content', url: 'https://www.promptingguide.ai/applications' }] },
        { id: 'safety', title: 'Safety & Evaluation', description: 'Prompt injection prevention, output validation, bias mitigation', url: 'https://roadmap.sh/prompt-engineering', resources: [{ label: 'Safety', url: 'https://www.promptingguide.ai/risks' }] },
      ]},
    ]
  },

  mlops: {
    id: 'mlops',
    title: 'MLOps',
    description: 'Operationalize machine learning systems',
    icon: '⚙️',
    url: 'https://roadmap.sh/mlops',
    color: '#4CAF50',
    sections: [
      { id: 'fundamentals', title: 'MLOps Fundamentals', topics: [
        { id: 'concepts', title: 'MLOps Concepts', description: 'ML lifecycle, maturity levels, reproducibility', url: 'https://roadmap.sh/mlops', resources: [{ label: 'MLOps', url: 'https://en.wikipedia.org/wiki/MLOps' }] },
        { id: 'versioning', title: 'Data & Model Versioning', description: 'DVC, Git LFS, model registries, experiment tracking', url: 'https://roadmap.sh/mlops', resources: [{ label: 'DVC', url: 'https://dvc.org' }] },
      ]},
      { id: 'development', title: 'Development & Training', topics: [
        { id: 'feature-eng', title: 'Feature Engineering', description: 'Feature stores, data pipelines, preprocessing', url: 'https://roadmap.sh/mlops', resources: [{ label: 'Feature Stores', url: 'https://feast.dev' }] },
        { id: 'training', title: 'Training & Experiments', description: 'Hyperparameter tuning, MLflow, Weights & Biases', url: 'https://roadmap.sh/mlops', resources: [{ label: 'MLflow', url: 'https://mlflow.org' }] },
      ]},
      { id: 'deployment', title: 'Deployment & Serving', topics: [
        { id: 'serving', title: 'Model Serving', description: 'TensorFlow Serving, TorchServe, KServe, Seldon Core', url: 'https://roadmap.sh/mlops', resources: [{ label: 'TF Serving', url: 'https://www.tensorflow.org/tfx/guide/serving' }] },
        { id: 'pipelines', title: 'ML Pipelines', description: 'Kubeflow, Apache Airflow, Vertex AI, SageMaker', url: 'https://roadmap.sh/mlops', resources: [{ label: 'Kubeflow', url: 'https://www.kubeflow.org' }] },
      ]},
      { id: 'monitoring', title: 'Monitoring & Maintenance', topics: [
        { id: 'drift', title: 'Model Monitoring & Drift', description: 'Data drift, concept drift, performance monitoring', url: 'https://roadmap.sh/mlops', resources: [{ label: 'Monitoring', url: 'https://en.wikipedia.org/wiki/Model_drift' }] },
        { id: 'cicd-ml', title: 'CI/CD for ML', description: 'Continuous training, automated retraining, A/B testing', url: 'https://roadmap.sh/mlops', resources: [{ label: 'CI/CD ML', url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning' }] },
      ]},
    ]
  },

  aiagents: {
    id: 'aiagents',
    title: 'AI Agents',
    description: 'Build autonomous AI agents and systems',
    icon: '🤖',
    url: 'https://roadmap.sh/ai-agents',
    color: '#9C27B0',
    sections: [
      { id: 'fundamentals', title: 'Agent Fundamentals', topics: [
        { id: 'concepts', title: 'Agent Concepts', description: 'Agent architecture, perception-action loops, goal-directed behavior', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'AI Agents', url: 'https://en.wikipedia.org/wiki/Intelligent_agent' }] },
        { id: 'llm-agents', title: 'LLM-based Agents', description: 'Prompt-driven agents, reasoning, planning, reflection', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'LLM Agents', url: 'https://www.deeplearning.ai/courses/' }] },
      ]},
      { id: 'frameworks', title: 'Agent Frameworks', topics: [
        { id: 'langchain', title: 'LangChain', description: 'Chains, agents, tools, memory, callbacks', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'LangChain', url: 'https://www.langchain.com' }] },
        { id: 'other-frameworks', title: 'Other Frameworks', description: 'CrewAI, AutoGen, LlamaIndex, Semantic Kernel', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'CrewAI', url: 'https://crewai.com' }] },
      ]},
      { id: 'development', title: 'Agent Development', topics: [
        { id: 'tools', title: 'Tool Use & APIs', description: 'Function calling, API integration, tool selection', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'Function Calling', url: 'https://openai.com/blog/function-calling-and-other-api-updates' }] },
        { id: 'memory', title: 'Memory & Context', description: 'Short/long-term memory, vector stores, RAG', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'Memory', url: 'https://www.pinecone.io' }] },
        { id: 'patterns', title: 'Agent Patterns', description: 'Multi-agent systems, supervisor patterns, human-in-the-loop', url: 'https://roadmap.sh/ai-agents', resources: [{ label: 'Patterns', url: 'https://www.deeplearning.ai/courses/' }] },
      ]},
    ]
  },

  airedteaming: {
    id: 'airedteaming',
    title: 'AI Red Teaming',
    description: 'Test and improve AI system security',
    icon: '🛡️',
    url: 'https://roadmap.sh/ai-red-teaming',
    color: '#E91E63',
    sections: [
      { id: 'fundamentals', title: 'Red Teaming Fundamentals', topics: [
        { id: 'concepts', title: 'Red Teaming Concepts', description: 'Adversarial testing methodology, threat modeling for AI', url: 'https://roadmap.sh/ai-red-teaming', resources: [{ label: 'Red Teaming', url: 'https://en.wikipedia.org/wiki/Red_team' }] },
        { id: 'ai-risks', title: 'AI Safety & Risks', description: 'Hallucination, bias, toxicity, information leakage', url: 'https://roadmap.sh/ai-red-teaming', resources: [{ label: 'AI Safety', url: 'https://aligned-ai.org' }] },
      ]},
      { id: 'attacks', title: 'Attack Techniques', topics: [
        { id: 'injection', title: 'Prompt Injection', description: 'Direct/indirect injection, jailbreaking, DAN-style attacks', url: 'https://roadmap.sh/ai-red-teaming', resources: [{ label: 'Injection', url: 'https://en.wikipedia.org/wiki/Prompt_injection' }] },
        { id: 'evasion', title: 'Evasion & Manipulation', description: 'Adversarial examples, model extraction, data poisoning', url: 'https://roadmap.sh/ai-red-teaming', resources: [{ label: 'Adversarial ML', url: 'https://en.wikipedia.org/wiki/Adversarial_machine_learning' }] },
      ]},
      { id: 'defense', title: 'Defense & Mitigation', topics: [
        { id: 'guardrails', title: 'Guardrails', description: 'Content filters, output validation, safety classifiers', url: 'https://roadmap.sh/ai-red-teaming', resources: [{ label: 'Guardrails', url: 'https://github.com/guardrails-ai/guardrails' }] },
        { id: 'evaluation', title: 'Evaluation & Reporting', description: 'Red team reports, vulnerability scoring, remediation', url: 'https://roadmap.sh/ai-red-teaming', resources: [{ label: 'Evaluation', url: 'https://en.wikipedia.org/wiki/Red_team' }] },
      ]},
    ]
  },

  blockchain: {
    id: 'blockchain',
    title: 'Blockchain',
    description: 'Distributed ledger technology and cryptocurrencies',
    icon: '⛓️',
    url: 'https://roadmap.sh/blockchain',
    color: '#F7931A',
    sections: [
      { id: 'fundamentals', title: 'Blockchain Fundamentals', topics: [
        { id: 'concepts', title: 'Core Concepts', description: 'Blockchain structure, consensus mechanisms (PoW, PoS), nodes', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'Blockchain', url: 'https://en.wikipedia.org/wiki/Blockchain' }] },
        { id: 'cryptography', title: 'Cryptography', description: 'Hashing, digital signatures, merkle trees, wallets', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'Crypto', url: 'https://en.wikipedia.org/wiki/Cryptography' }] },
      ]},
      { id: 'ethereum', title: 'Ethereum & Smart Contracts', topics: [
        { id: 'solidity', title: 'Solidity', description: 'Smart contract language, data types, functions, modifiers', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'Solidity', url: 'https://soliditylang.org' }] },
        { id: 'evm', title: 'EVM & Gas', description: 'Ethereum Virtual Machine, gas optimization, opcodes', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'EVM', url: 'https://ethereum.org/en/developers/docs/evm/' }] },
        { id: 'tools', title: 'Development Tools', description: 'Hardhat, Foundry, Remix, Ethers.js, Wagmi', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'Hardhat', url: 'https://hardhat.org' }] },
      ]},
      { id: 'dapps', title: 'DApps & Web3', topics: [
        { id: 'frontend', title: 'Web3 Frontend', description: 'Web3.js, Ethers.js, wallet connections, MetaMask', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'Web3.js', url: 'https://web3js.org' }] },
        { id: 'defi-nft', title: 'DeFi & NFTs', description: 'Tokens (ERC-20/721/1155), AMMs, lending protocols', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'OpenZeppelin', url: 'https://openzeppelin.com' }] },
      ]},
      { id: 'security', title: 'Security & Auditing', topics: [
        { id: 'audit', title: 'Smart Contract Security', description: 'Common vulnerabilities, reentrancy, auditing tools', url: 'https://roadmap.sh/blockchain', resources: [{ label: 'Security', url: 'https://swcregistry.io' }] },
      ]},
    ]
  },

  gamedeveloper: {
    id: 'gamedeveloper',
    title: 'Game Developer',
    description: 'Develop interactive games and entertainment',
    icon: '🎮',
    url: 'https://roadmap.sh/game-developer',
    color: '#FF6B6B',
    sections: [
      { id: 'fundamentals', title: 'Game Development Basics', topics: [
        { id: 'concepts', title: 'Game Concepts', description: 'Game loops, rendering pipeline, delta time, frame rate', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Game Dev', url: 'https://en.wikipedia.org/wiki/Video_game_development' }] },
        { id: 'math', title: 'Game Math', description: 'Vectors, matrices, quaternions, trigonometry, physics', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Game Math', url: 'https://www.essentialmathforcompgames.com' }] },
        { id: 'design', title: 'Game Design', description: 'Mechanics, dynamics, aesthetics, level design, balancing', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Design', url: 'https://en.wikipedia.org/wiki/Game_design' }] },
      ]},
      { id: 'engines', title: 'Game Engines', topics: [
        { id: 'unity', title: 'Unity', description: 'C# scripting, GameObjects, MonoBehaviour, scenes', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Unity', url: 'https://unity.com' }] },
        { id: 'unreal', title: 'Unreal Engine', description: 'Blueprints, C++, UE materials, Niagara, landscapes', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Unreal', url: 'https://www.unrealengine.com' }] },
        { id: 'godot', title: 'Godot', description: 'GDScript, scenes & nodes, signals, 2D/3D', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Godot', url: 'https://godotengine.org' }] },
      ]},
      { id: 'graphics', title: 'Graphics & Audio', topics: [
        { id: '3d-graphics', title: '3D Graphics', description: 'OpenGL/Vulkan, shaders, lighting, post-processing', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'LearnOpenGL', url: 'https://learnopengl.com' }] },
        { id: 'physics', title: 'Physics & Collision', description: 'Rigidbodies, collision detection, raycasting, joints', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Physics', url: 'https://en.wikipedia.org/wiki/Physics_engine' }] },
        { id: 'audio', title: 'Game Audio', description: 'Sound effects, spatial audio, music systems, FMOD/Wwise', url: 'https://roadmap.sh/game-developer', resources: [{ label: 'Audio', url: 'https://en.wikipedia.org/wiki/Video_game_audio' }] },
      ]},
    ]
  },

  computerscience: {
    id: 'computerscience',
    title: 'Computer Science',
    description: 'Fundamental concepts of computer science',
    icon: '💾',
    url: 'https://roadmap.sh/computer-science',
    color: '#0288D1',
    sections: [
      { id: 'fundamentals', title: 'Fundamentals', topics: [
        { id: 'logic', title: 'Logic & Discrete Math', description: 'Boolean logic, set theory, combinatorics, proofs', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Discrete Math', url: 'https://en.wikipedia.org/wiki/Discrete_mathematics' }] },
        { id: 'numbersystems', title: 'Number Systems', description: 'Binary, hexadecimal, floating point, two\'s complement', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Number Systems', url: 'https://en.wikipedia.org/wiki/Binary_number' }] },
      ]},
      { id: 'systems', title: 'Computer Systems', topics: [
        { id: 'architecture', title: 'Computer Architecture', description: 'CPU, memory hierarchy, caching, pipelining, ISA', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Architecture', url: 'https://en.wikipedia.org/wiki/Computer_architecture' }] },
        { id: 'os', title: 'Operating Systems', description: 'Processes, threads, memory management, file systems, scheduling', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'OS', url: 'https://en.wikipedia.org/wiki/Operating_system' }] },
        { id: 'networking', title: 'Computer Networking', description: 'OSI model, TCP/IP, HTTP, DNS, routing, sockets', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Networking', url: 'https://en.wikipedia.org/wiki/Computer_network' }] },
      ]},
      { id: 'theory', title: 'Theory & Algorithms', topics: [
        { id: 'algorithms', title: 'Algorithms', description: 'Sorting, searching, graph algorithms, dynamic programming', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Algorithms', url: 'https://en.wikipedia.org/wiki/Algorithm' }] },
        { id: 'theory', title: 'Computation Theory', description: 'Turing machines, complexity classes, NP-completeness, automata', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Computation', url: 'https://en.wikipedia.org/wiki/Computational_complexity_theory' }] },
        { id: 'databases', title: 'Database Theory', description: 'Relational algebra, normalization, ACID, transactions', url: 'https://roadmap.sh/computer-science', resources: [{ label: 'Databases', url: 'https://en.wikipedia.org/wiki/Database' }] },
      ]},
    ]
  },

  datastructures: {
    id: 'datastructures',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms',
    icon: '📚',
    url: 'https://roadmap.sh/dsa',
    color: '#1565C0',
    sections: [
      { id: 'basics', title: 'Linear Data Structures', topics: [
        { id: 'arrays', title: 'Arrays & Lists', description: 'Static arrays, dynamic arrays, linked lists (singly/doubly)', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Arrays', url: 'https://en.wikipedia.org/wiki/Array_data_structure' }] },
        { id: 'stacks-queues', title: 'Stacks & Queues', description: 'Stack operations, queue types, deque, priority queue', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Stacks', url: 'https://en.wikipedia.org/wiki/Stack_(abstract_data_type)' }] },
        { id: 'hashing', title: 'Hash Tables', description: 'Hash functions, collision resolution, hash maps, hash sets', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Hashing', url: 'https://en.wikipedia.org/wiki/Hash_table' }] },
      ]},
      { id: 'trees', title: 'Trees & Graphs', topics: [
        { id: 'binary-trees', title: 'Binary Trees & BST', description: 'Traversal (inorder, preorder, postorder), BST operations', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Trees', url: 'https://en.wikipedia.org/wiki/Binary_tree' }] },
        { id: 'heaps', title: 'Heaps & Tries', description: 'Min/max heaps, heap sort, trie operations, prefix matching', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Heaps', url: 'https://en.wikipedia.org/wiki/Heap_(data_structure)' }] },
        { id: 'graphs', title: 'Graphs', description: 'BFS, DFS, Dijkstra, topological sort, MST (Kruskal/Prim)', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Graphs', url: 'https://en.wikipedia.org/wiki/Graph_(abstract_data_type)' }] },
      ]},
      { id: 'algorithms', title: 'Core Algorithms', topics: [
        { id: 'sorting', title: 'Sorting Algorithms', description: 'Bubble, merge, quick, heap sort, counting sort, radix', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Sorting', url: 'https://en.wikipedia.org/wiki/Sorting_algorithm' }] },
        { id: 'searching', title: 'Searching', description: 'Binary search, two pointers, sliding window', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Binary Search', url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm' }] },
        { id: 'dp', title: 'Dynamic Programming', description: 'Memoization, tabulation, common DP patterns', url: 'https://roadmap.sh/dsa', resources: [{ label: 'DP', url: 'https://en.wikipedia.org/wiki/Dynamic_programming' }] },
        { id: 'greedy', title: 'Greedy & Backtracking', description: 'Greedy choice property, backtracking, recursion', url: 'https://roadmap.sh/dsa', resources: [{ label: 'Greedy', url: 'https://en.wikipedia.org/wiki/Greedy_algorithm' }] },
      ]},
    ]
  },

  technicalwriter: {
    id: 'technicalwriter',
    title: 'Technical Writer',
    description: 'Create clear technical documentation',
    icon: '✍️',
    url: 'https://roadmap.sh/technical-writer',
    color: '#455A64',
    sections: [
      { id: 'fundamentals', title: 'Writing Fundamentals', topics: [
        { id: 'principles', title: 'Writing Principles', description: 'Clarity, conciseness, audience analysis, style guides', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'Technical Writing', url: 'https://en.wikipedia.org/wiki/Technical_writing' }] },
        { id: 'documentation', title: 'Documentation Types', description: 'API docs, user guides, tutorials, release notes, READMEs', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'Documentation', url: 'https://www.writethedocs.org' }] },
        { id: 'editing', title: 'Editing & Review', description: 'Peer review, editing checklists, consistency standards', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'Editing', url: 'https://www.writethedocs.org' }] },
      ]},
      { id: 'tools', title: 'Tools & Technology', topics: [
        { id: 'markup', title: 'Markup Languages', description: 'Markdown, reStructuredText, AsciiDoc, DITA', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'Markdown', url: 'https://www.markdownguide.org' }] },
        { id: 'tools', title: 'Documentation Tools', description: 'Sphinx, MkDocs, GitBook, Docusaurus, ReadTheDocs', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'MkDocs', url: 'https://www.mkdocs.org' }] },
      ]},
      { id: 'api-docs', title: 'API Documentation', topics: [
        { id: 'openapi', title: 'OpenAPI & Swagger', description: 'Spec writing, Swagger UI, Redoc, code samples', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'OpenAPI', url: 'https://www.openapis.org' }] },
        { id: 'docs-as-code', title: 'Docs as Code', description: 'Git workflows, CI/CD for docs, automated testing', url: 'https://roadmap.sh/technical-writer', resources: [{ label: 'Docs as Code', url: 'https://www.writethedocs.org/guide/docs-as-code/' }] },
      ]},
    ]
  },

  productmanager: {
    id: 'productmanager',
    title: 'Product Manager',
    description: 'Lead product vision and strategy',
    icon: '📈',
    url: 'https://roadmap.sh/product-manager',
    color: '#00BCD4',
    sections: [
      { id: 'fundamentals', title: 'PM Fundamentals', topics: [
        { id: 'philosophy', title: 'Product Philosophy', description: 'Product vision, strategy, product-market fit, OKRs', url: 'https://roadmap.sh/product-manager', resources: [{ label: 'Product Management', url: 'https://en.wikipedia.org/wiki/Product_management' }] },
        { id: 'research', title: 'Customer Research', description: 'User interviews, surveys, market analysis, competitive analysis', url: 'https://roadmap.sh/product-manager', resources: [{ label: 'Research Methods', url: 'https://www.nngroup.com/articles/user-research-methods/' }] },
      ]},
      { id: 'execution', title: 'Execution', topics: [
        { id: 'delivery', title: 'Product Delivery', description: 'Agile, scrum, sprint planning, backlog management, roadmaps', url: 'https://roadmap.sh/product-manager', resources: [{ label: 'Agile', url: 'https://www.agilealliance.org' }] },
        { id: 'prioritization', title: 'Prioritization', description: 'RICE, MoSCoW, impact mapping, story mapping', url: 'https://roadmap.sh/product-manager', resources: [{ label: 'Prioritization', url: 'https://en.wikipedia.org/wiki/MoSCoW_method' }] },
      ]},
      { id: 'analytics', title: 'Analytics & Growth', topics: [
        { id: 'metrics', title: 'Metrics & KPIs', description: 'AARRR funnel, retention, LTV, churn, NPS', url: 'https://roadmap.sh/product-manager', resources: [{ label: 'Analytics', url: 'https://en.wikipedia.org/wiki/Web_analytics' }] },
        { id: 'experimentation', title: 'Experimentation', description: 'A/B testing, feature flags, data-driven decisions', url: 'https://roadmap.sh/product-manager', resources: [{ label: 'A/B Testing', url: 'https://en.wikipedia.org/wiki/A/B_testing' }] },
      ]},
    ]
  },

  engineeringmanager: {
    id: 'engineeringmanager',
    title: 'Engineering Manager',
    description: 'Lead engineering teams and culture',
    icon: '👔',
    url: 'https://roadmap.sh/engineering-manager',
    color: '#3F51B5',
    sections: [
      { id: 'people', title: 'People Management', topics: [
        { id: 'leadership', title: 'Leadership Skills', description: 'Mentoring, coaching, delegation, feedback, 1:1s', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'Leadership', url: 'https://en.wikipedia.org/wiki/Leadership' }] },
        { id: 'hiring', title: 'Hiring & Development', description: 'Recruitment, onboarding, career ladders, performance reviews', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'Hiring', url: 'https://en.wikipedia.org/wiki/Human_resources' }] },
        { id: 'culture', title: 'Team Culture', description: 'Psychological safety, diversity & inclusion, team health', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'Culture', url: 'https://rework.withgoogle.com' }] },
      ]},
      { id: 'technical', title: 'Technical Leadership', topics: [
        { id: 'architecture', title: 'Technical Architecture', description: 'Design decisions, technical strategy, tech debt management', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'Architecture', url: 'https://en.wikipedia.org/wiki/Software_architect' }] },
        { id: 'processes', title: 'Engineering Processes', description: 'Code review, CI/CD, incident management, on-call', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'Engineering', url: 'https://en.wikipedia.org/wiki/Software_engineering' }] },
      ]},
      { id: 'strategy', title: 'Strategy & Execution', topics: [
        { id: 'planning', title: 'Planning & Roadmaps', description: 'Quarterly planning, OKRs, resource allocation', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'OKRs', url: 'https://en.wikipedia.org/wiki/OKR' }] },
        { id: 'stakeholders', title: 'Stakeholder Management', description: 'Cross-functional communication, reporting, influence', url: 'https://roadmap.sh/engineering-manager', resources: [{ label: 'Stakeholders', url: 'https://en.wikipedia.org/wiki/Stakeholder_(corporate)' }] },
      ]},
    ]
  },

  developerrelations: {
    id: 'developerrelations',
    title: 'Developer Relations',
    description: 'Build communities and advocate for developers',
    icon: '🤝',
    url: 'https://roadmap.sh/developer-relations',
    color: '#009688',
    sections: [
      { id: 'fundamentals', title: 'DevRel Fundamentals', topics: [
        { id: 'strategies', title: 'Community Strategy', description: 'Developer advocacy, community building, events, meetups', url: 'https://roadmap.sh/developer-relations', resources: [{ label: 'DevRel', url: 'https://en.wikipedia.org/wiki/Developer_relations' }] },
        { id: 'communication', title: 'Communication', description: 'Technical talks, blog posts, video content, social media', url: 'https://roadmap.sh/developer-relations', resources: [{ label: 'Technical Content', url: 'https://www.writethedocs.org' }] },
      ]},
      { id: 'programs', title: 'Programs & Content', topics: [
        { id: 'dev-programs', title: 'Developer Programs', description: 'Beta programs, ambassador programs, hackathons', url: 'https://roadmap.sh/developer-relations', resources: [{ label: 'Programs', url: 'https://en.wikipedia.org/wiki/Developer_relations' }] },
        { id: 'docs-samples', title: 'Docs & Sample Code', description: 'SDK documentation, code examples, quickstarts, tutorials', url: 'https://roadmap.sh/developer-relations', resources: [{ label: 'Docs', url: 'https://www.writethedocs.org' }] },
      ]},
      { id: 'metrics', title: 'Metrics & Impact', topics: [
        { id: 'measurement', title: 'Measuring Impact', description: 'Developer adoption, engagement metrics, NPS, feedback loops', url: 'https://roadmap.sh/developer-relations', resources: [{ label: 'Metrics', url: 'https://en.wikipedia.org/wiki/Developer_relations' }] },
      ]},
    ]
  },

  elasticsearch: {
    id: 'elasticsearch',
    title: 'Elasticsearch',
    description: 'Search and analytics engine',
    icon: '🔍',
    url: 'https://elastic.co',
    color: '#005571',
    sections: [
      { id: 'basics', title: 'Elasticsearch Basics', topics: [
        { id: 'concepts', title: 'Core Concepts', description: 'Indices, documents, mapping, shards, replicas', url: 'https://elastic.co', resources: [{ label: 'Docs', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html' }] },
        { id: 'crud', title: 'CRUD Operations', description: 'Indexing, getting, updating, deleting documents, bulk API', url: 'https://elastic.co', resources: [{ label: 'CRUD', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html' }] },
      ]},
      { id: 'querying', title: 'Querying & Analysis', topics: [
        { id: 'query-dsl', title: 'Query DSL', description: 'Match, term, bool, range queries, full-text search', url: 'https://elastic.co', resources: [{ label: 'Query DSL', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html' }] },
        { id: 'aggregations', title: 'Aggregations', description: 'Bucket, metric, pipeline aggregations, faceted search', url: 'https://elastic.co', resources: [{ label: 'Aggregations', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html' }] },
        { id: 'analyzers', title: 'Analyzers & Tokenizers', description: 'Custom analyzers, tokenizers, filters, language analysis', url: 'https://elastic.co', resources: [{ label: 'Analyzers', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html' }] },
      ]},
      { id: 'advanced', title: 'Advanced Topics', topics: [
        { id: 'cluster', title: 'Cluster Management', description: 'Sharding strategy, replication, cluster health, scaling', url: 'https://elastic.co', resources: [{ label: 'Cluster', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-cluster.html' }] },
        { id: 'kibana', title: 'Kibana & Visualization', description: 'Dashboards, Lens, Discover, Canvas, alerting', url: 'https://elastic.co', resources: [{ label: 'Kibana', url: 'https://www.elastic.co/kibana' }] },
      ]},
    ]
  },

  wordpress: {
    id: 'wordpress',
    title: 'WordPress',
    description: 'Content management system for web',
    icon: '📝',
    url: 'https://wordpress.org',
    color: '#21759B',
    sections: [
      { id: 'basics', title: 'WordPress Basics', topics: [
        { id: 'installation', title: 'Installation & Setup', description: 'Installation, configuration, hosting, basic settings', url: 'https://wordpress.org', resources: [{ label: 'Docs', url: 'https://wordpress.org/support/' }] },
        { id: 'core', title: 'Core Concepts', description: 'Posts, pages, categories, tags, menus, widgets', url: 'https://wordpress.org', resources: [{ label: 'Getting Started', url: 'https://wordpress.org/support/article/getting-started-with-wordpress/' }] },
        { id: 'customizer', title: 'Site Customization', description: 'Themes, full site editing, blocks, patterns', url: 'https://wordpress.org', resources: [{ label: 'Customizer', url: 'https://developer.wordpress.org/block-editor/' }] },
      ]},
      { id: 'development', title: 'Theme Development', topics: [
        { id: 'themes', title: 'Theme Structure', description: 'Template hierarchy, template parts, functions.php', url: 'https://wordpress.org', resources: [{ label: 'Theme Dev', url: 'https://developer.wordpress.org/themes/' }] },
        { id: 'blocks', title: 'Block Development', description: 'Custom blocks, block.json, React-based blocks', url: 'https://wordpress.org', resources: [{ label: 'Block Dev', url: 'https://developer.wordpress.org/block-editor/getting-started/' }] },
      ]},
      { id: 'plugins', title: 'Plugin Development', topics: [
        { id: 'plugin-arch', title: 'Plugin Architecture', description: 'Hooks, filters, actions, custom post types, REST API', url: 'https://wordpress.org', resources: [{ label: 'Plugin Dev', url: 'https://developer.wordpress.org/plugins/' }] },
        { id: 'woocommerce', title: 'WooCommerce', description: 'E-commerce, products, payments, shipping, extensions', url: 'https://wordpress.org', resources: [{ label: 'WooCommerce', url: 'https://woocommerce.com' }] },
      ]},
    ]
  },

  cloudflare: {
    id: 'cloudflare',
    title: 'Cloudflare',
    description: 'CDN and website security platform',
    icon: '☁️',
    url: 'https://cloudflare.com',
    color: '#F38020',
    sections: [
      { id: 'basics', title: 'Cloudflare Basics', topics: [
        { id: 'setup', title: 'Setup & Configuration', description: 'DNS setup, nameserver configuration, proxy modes', url: 'https://cloudflare.com', resources: [{ label: 'Docs', url: 'https://developers.cloudflare.com/dns/' }] },
        { id: 'cdn', title: 'CDN & Performance', description: 'Caching rules, cache keys, Argo, Polish, Mirage', url: 'https://cloudflare.com', resources: [{ label: 'CDN', url: 'https://developers.cloudflare.com/cache/' }] },
      ]},
      { id: 'security', title: 'Security', topics: [
        { id: 'ddos', title: 'DDoS Protection', description: 'DDoS mitigation, rate limiting, bot management', url: 'https://cloudflare.com', resources: [{ label: 'DDoS', url: 'https://developers.cloudflare.com/ddos-protection/' }] },
        { id: 'waf', title: 'WAF & SSL', description: 'Web application firewall, managed rules, SSL/TLS modes', url: 'https://cloudflare.com', resources: [{ label: 'WAF', url: 'https://developers.cloudflare.com/waf/' }] },
      ]},
      { id: 'advanced', title: 'Advanced Features', topics: [
        { id: 'workers', title: 'Cloudflare Workers', description: 'Serverless functions, KV storage, Durable Objects, D1', url: 'https://cloudflare.com', resources: [{ label: 'Workers', url: 'https://developers.cloudflare.com/workers/' }] },
        { id: 'pages', title: 'Cloudflare Pages', description: 'JAMstack deployments, CI/CD, Functions, integrations', url: 'https://cloudflare.com', resources: [{ label: 'Pages', url: 'https://developers.cloudflare.com/pages/' }] },
      ]},
    ]
  },

  designsystem: {
    id: 'designsystem',
    title: 'Design System',
    description: 'Create and maintain design systems',
    icon: '🎨',
    url: 'https://roadmap.sh/design-system',
    color: '#7B1FA2',
    sections: [
      { id: 'fundamentals', title: 'Design System Basics', topics: [
        { id: 'concepts', title: 'Core Concepts', description: 'Design tokens, components, patterns, principles', url: 'https://roadmap.sh/design-system', resources: [{ label: 'Design Systems', url: 'https://www.designsystems.com' }] },
        { id: 'tokens', title: 'Design Tokens', description: 'Colors, typography, spacing, shadows, breakpoints', url: 'https://roadmap.sh/design-system', resources: [{ label: 'Tokens', url: 'https://designtokens.org' }] },
      ]},
      { id: 'development', title: 'Component Development', topics: [
        { id: 'components', title: 'Component Libraries', description: 'Storybook, component API design, accessibility (a11y)', url: 'https://roadmap.sh/design-system', resources: [{ label: 'Storybook', url: 'https://storybook.js.org' }] },
        { id: 'figma', title: 'Design Tools Integration', description: 'Figma components, variants, auto layout, design-dev sync', url: 'https://roadmap.sh/design-system', resources: [{ label: 'Figma', url: 'https://figma.com' }] },
      ]},
      { id: 'governance', title: 'Governance & Adoption', topics: [
        { id: 'versioning', title: 'Versioning & Publishing', description: 'Semantic versioning, changelogs, npm publishing, CI/CD', url: 'https://roadmap.sh/design-system', resources: [{ label: 'Semver', url: 'https://semver.org' }] },
        { id: 'contribution', title: 'Contribution & Governance', description: 'Contribution guidelines, RFC process, deprecation strategy', url: 'https://roadmap.sh/design-system', resources: [{ label: 'Governance', url: 'https://www.smashingmagazine.com/design-systems/' }] },
      ]},
    ]
  },

};

export const SKILL_TO_ROADMAP = {
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'react js': 'react',
  'javascript': 'javascript',
  'js': 'javascript',
  'vanilla javascript': 'javascript',
  'vanilla js': 'javascript',
  'python': 'python',
  'python3': 'python',
  'python 3': 'python',
  'java': 'java',
  'core java': 'java',
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'node js': 'nodejs',
  'typescript': 'typescript',
  'ts': 'typescript',
  'docker': 'docker',
  'sql': 'sql',
  'mysql': 'sql',
  'postgresql': 'sql',
  'postgres': 'sql',
  'git': 'git-github',
  'github': 'git-github',
  'git & github': 'git-github',
  'git and github': 'git-github',
  'spring boot': 'spring-boot',
  'spring': 'spring-boot',
  'springboot': 'spring-boot',
  'vue': 'vue',
  'vue.js': 'vue',
  'vue js': 'vue',
  'angular': 'angular',
  'angularjs': 'angular',
  'angular.js': 'angular',
  'css': 'css',
  'web design': 'css',
  'css3': 'css',
  'graphql': 'graphql',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'aws': 'aws',
  'amazon web services': 'aws',
  'go': 'go',
  'golang': 'go',
  'mongodb': 'mongodb',
  'mongo': 'mongodb',
  'rust': 'rust',
  'frontend': 'frontend',
  'frontend developer': 'frontend',
  'frontend development': 'frontend',
  'front-end': 'frontend',
  'backend': 'backend',
  'backend developer': 'backend',
  'backend development': 'backend',
  'back-end': 'backend',
  'fullstack': 'fullstack',
  'full stack': 'fullstack',
  'full-stack': 'fullstack',
  'devops': 'devops',
  'dev ops': 'devops',
  'infrastructure': 'devops',
  'devsecops': 'devsecops',
  'dev secops': 'devsecops',
  'devsecoops': 'devsecops',
  'data analyst': 'dataanalyst',
  'dataanalyst': 'dataanalyst',
  'data analysis': 'dataanalyst',
  'analytics': 'dataanalyst',
  'ai engineer': 'aiEngineer',
  'ai-engineer': 'aiEngineer',
  'artificial intelligence': 'aiEngineer',
  'data engineer': 'dataengineer',
  'dataengineer': 'dataengineer',
  'data engineering': 'dataengineer',
  'android': 'android',
  'android developer': 'android',
  'android development': 'android',
  'ios': 'ios',
  'ios developer': 'ios',
  'ios development': 'ios',
  'iphone': 'ios',
  'next': 'nextjs',
  'next.js': 'nextjs',
  'nextjs': 'nextjs',
  'system design': 'systemdesign',
  'systemdesign': 'systemdesign',
  'system architecture': 'systemdesign',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'postgres sql': 'postgresql',
  'linux': 'linux',
  'unix': 'linux',
  'ubuntu': 'linux',
  'centos': 'linux',
  'terraform': 'terraform',
  'terraform iac': 'terraform',
  'infrastructure as code': 'terraform',
  'iac': 'terraform',
  'redis': 'redis',
  'cache': 'redis',
  'caching': 'redis',
  'html': 'html',
  'html5': 'html',
  'markup': 'html',
  'php': 'php',
  'php programming': 'php',
  'kotlin': 'kotlin',
  'kotlin programming': 'kotlin',
  'swift': 'swift',
  'swiftui': 'swift',
  'swift programming': 'swift',
  'c++': 'cpp',
  'cpp': 'cpp',
  'c plus plus': 'cpp',
  'systems programming': 'cpp',
  'asp.net': 'aspnetcore',
  'asp.net core': 'aspnetcore',
  'aspnetcore': 'aspnetcore',
  '.net': 'aspnetcore',
  'flutter': 'flutter',
  'flutter development': 'flutter',
  'dart': 'flutter',
  'react native': 'reactnative',
  'reactnative': 'reactnative',
  'react-native': 'reactnative',
  'django': 'django',
  'django framework': 'django',
  'web framework': 'django',
  'laravel': 'laravel',
  'laravel framework': 'laravel',
  'php framework': 'laravel',
  'ruby': 'ruby',
  'ruby programming': 'ruby',
  'bash': 'bash',
  'shell': 'bash',
  'shell scripting': 'bash',
  'sh': 'bash',
  'command line': 'bash',
  'machine learning': 'machinelearning',
  'ml': 'machinelearning',
  'deep learning': 'machinelearning',
  'neural networks': 'machinelearning',
  'qa': 'qa',
  'quality assurance': 'qa',
  'testing': 'qa',
  'test automation': 'qa',
  'software architect': 'softwarearchitect',
  'architecture': 'softwarearchitect',
  'system design': 'softwarearchitect',
  'api design': 'apidesign',
  'api development': 'apidesign',
  'rest api': 'apidesign',
  'cyber security': 'cybersecurity',
  'cybersecurity': 'cybersecurity',
  'security': 'cybersecurity',
  'information security': 'cybersecurity',
  'ux design': 'uxdesign',
  'user experience': 'uxdesign',
  'ui design': 'uxdesign',
  'design': 'uxdesign',
  'prompt engineering': 'promptengineering',
  'prompting': 'promptengineering',
  'llm': 'promptengineering',
  'gpt': 'promptengineering',
  'mlops': 'mlops',
  'ml ops': 'mlops',
  'model deployment': 'mlops',
  'ai agents': 'aiagents',
  'agents': 'aiagents',
  'autonomous agents': 'aiagents',
  'ai red teaming': 'airedteaming',
  'red teaming': 'airedteaming',
  'adversarial testing': 'airedteaming',
  'blockchain': 'blockchain',
  'web3': 'blockchain',
  'crypto': 'blockchain',
  'ethereum': 'blockchain',
  'smart contracts': 'blockchain',
  'game development': 'gamedeveloper',
  'game developer': 'gamedeveloper',
  'unity': 'gamedeveloper',
  'unreal': 'gamedeveloper',
  'godot': 'gamedeveloper',
  'computer science': 'computerscience',
  'cs': 'computerscience',
  'algorithms': 'datastructures',
  'data structures': 'datastructures',
  'dsa': 'datastructures',
  'sorting': 'datastructures',
  'trees': 'datastructures',
  'graphs': 'datastructures',
  'technical writer': 'technicalwriter',
  'technical writing': 'technicalwriter',
  'documentation': 'technicalwriter',
  'product manager': 'productmanager',
  'product management': 'productmanager',
  'product strategy': 'productmanager',
  'engineering manager': 'engineeringmanager',
  'manager': 'engineeringmanager',
  'team lead': 'engineeringmanager',
  'leader': 'engineeringmanager',
  'developer relations': 'developerrelations',
  'devrel': 'developerrelations',
  'community': 'developerrelations',
  'advocacy': 'developerrelations',
  'elasticsearch': 'elasticsearch',
  'elastic': 'elasticsearch',
  'search': 'elasticsearch',
  'wordpress': 'wordpress',
  'wp': 'wordpress',
  'cloudflare': 'cloudflare',
  'cdn': 'cloudflare',
  'design system': 'designsystem',
  'design systems': 'designsystem',
  'component library': 'designsystem',
};

export function getRoadmapForSkill(skillName) {
  if (!skillName) return null;
  const normalized = skillName.toLowerCase().trim();
  const roadmapId = SKILL_TO_ROADMAP[normalized];
  if (roadmapId && ROADMAPS[roadmapId]) return ROADMAPS[roadmapId];
  for (const [key, id] of Object.entries(SKILL_TO_ROADMAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      if (ROADMAPS[id]) return ROADMAPS[id];
    }
  }
  return null;
}

export function getAvailableRoadmaps() {
  return Object.values(ROADMAPS);
}