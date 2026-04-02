
#include <bits/stdc++.h>
#define pb push_back
#define mp make_pair
#define ff first
#define ss second

using namespace std;
int n, m, k1, k2;
int a[105][105];
int dp[3][105][105];
/* dp[1][i][j] - masha (i, j) ocij chadah hamgiin baga zardal
 dp[2][i][j] - baavgai (i, j) ocij chadah hamgiin baga zardal
 */
bool check(int xx, int yy)
{
    if(xx < 1 || yy < 1 || xx > n || yy > m || a[xx][yy] == 1) return 0;
    return 1;
}
int main() {
    int i , j , test;
    cin >> test;
    while(test--){
        cin >> n >> m >> k1 >> k2;
        for(i = 1; i <= n; i++)
            for(j = 1; j <= m; j++) cin >> a[i][j];
        for(i = 1; i <= n; i++)
            for(j = 1; j <= m; j++) dp[1][i][j] = dp[2][i][j] = 1e9;
        queue<pair<int,int> > Q;
        Q.push(mp(1 , 1));
        dp[1][1][1] = 0;
        while(!Q.empty())
        {
            int x = Q.front().ff;
            int y = Q.front().ss;
            Q.pop();
            for(i = -k1; i <= k1; i++)
                for(j = -k1; j <= k1; j++)
                {
                    int xx = x + i;
                    int yy = y + j;
                    if(dp[1][xx][yy] > dp[1][x][y] + 1 && check(xx, yy) && abs(x - xx) + abs(y - yy) <= k1)
                    {
                        dp[1][xx][yy] = dp[1][x][y] + 1;
                        Q.push(mp(xx, yy));
                    }
                }
        }
        Q.push(mp(1,m));
        dp[2][1][m] = 0;
        while(!Q.empty())
        {
            int x = Q.front().ff;
            int y = Q.front().ss;
            Q.pop();
            for(i = -k2; i <= k2; i++)
                for(j = -k2; j <= k2; j++)
                {
                    int xx = x + i;
                    int yy = y + j;
                    if(dp[2][xx][yy] > dp[2][x][y] + 1 && check(xx, yy) && abs(x - xx) + abs(y - yy) <= k2)
                    {
                        dp[2][xx][yy] = dp[2][x][y] + 1;
                        Q.push(mp(xx, yy));
                    }
                }
        }
        int res = 1e9;
        for(i = 1; i <= n; i++)
            for(j = 1; j <= m; j++) res = min(res, max(dp[1][i][j], dp[2][i][j]));
        if(res == 1e9) res = -1;
        cout << res << '\n';
    }
    return 0;
}

