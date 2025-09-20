#!/bin/bash

# Build the project
echo "Building Hellcat Store..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready for deployment to Netlify!"
    echo ""
    echo "To deploy:"
    echo "1. Go to https://netlify.com"
    echo "2. Connect your GitHub repository"
    echo "3. Select 'teamboex/hellcat'"
    echo "4. Deploy!"
    echo ""
    echo "Or use Netlify CLI:"
    echo "npm install -g netlify-cli"
    echo "netlify deploy --prod --dir=build"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi
