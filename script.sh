# Deploy functions to firebase
start=$(date +%s)
{
    firebase deploy
    echo '\n\033[0;32m========= Deployment Successful! ========='
    end=$(date +%s)
    runtime=$((end - start))
    echo "Execution time : " $runtime"s\033[0m\n"
} || {
    echo '\n\033[0;31m========= Something went wrong! ========='
    end=$(date +%s)
    runtime=$((end - start))
    echo "Execution time : " $runtime"s\033[0m\n"
}
