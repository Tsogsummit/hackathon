#include <bits/stdc++.h>

using namespace std;

int dp[2001][2001];

int main() {
    int n , k , i , j;
    cin >> n >> k;
    for(i = 1 ; i <= n ; i++){
        dp[0][i] = 1;
    }
    for(i = 1 ; i <= n ; i++){
        for(j = 1 ; j <= n ; j++){
            if(i >= j) dp[i][j] = (dp[i - j][j] + dp[i][j - 1])%k;
            else dp[i][j] = dp[i][j - 1];
        }
    }
    cout << dp[n][n];
    return 0;
}
