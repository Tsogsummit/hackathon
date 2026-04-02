#include <bits/stdc++.h>

using namespace std;

bool dp[500005];

int main(){
    int j , n , m = 0 , i , a[100001];
    scanf("%d",&n);
    for(j = 1 ; j <= n ; j++){
        scanf("%d",&a[j]);
        m += a[j];
    }
    dp[0] = 1;
    for(j = 1; j <= n; j++){
        for(i = m ; i >= 1 ; i--)  if(i - a[j] >= 0) dp[i] |= dp[i - a[j]];
    }
    int res = 1e9;
    for(i = 1 ; i <= m ; i++) if(dp[i]) res = min(res, abs((m - i) - i));
    printf("%d",res);
    return 0;
}
